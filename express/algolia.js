/* eslint-disable */
const algoliasearch = require("algoliasearch");

/* export const client = algoliasearch(
  "XD7RZG62BF",
  "21e90530eb95b823eaa2d88154123b2b"
); */
const defaultFacets = [
  "collections_names",
  "collections_slugs",
  "productVariants.stock_quantity",
  "productVariants.availableForSale",
  "kInventory",
];

const customFacet = {
  kInventory: "kInventory",
};
const defaultsSearchableAttributes = [
  "name",
  "collections_names",
  "collections_slugs",
  "productVariants.description",
  "productVariants.stock_quantity",
];
const enviroment = process.env.NODE_ENV || "development";

const client =
  enviroment == "development"
    ? algoliasearch("DL3F82QV71", "f2bf466c1d2c6164cbb06a51b377c288")
    : enviroment == "production"
    ? algoliasearch("DL3F82QV71", "f2bf466c1d2c6164cbb06a51b377c288")
    : null;
const internalIndexes = {};

const createReplicaIndex = (
  eCommerceId,
  eComerceDomain,
  eComerceCurrencies,
  locale,
  replicas
) => {
  replicas.map((e) => {
    const repInde = client.initIndex(e.full);
    internalIndexes[
      `${eCommerceId}_${eComerceDomain}_${locale.code}_` + e.param
    ] = repInde;

    repInde
      .setSettings({
        ranking: [`asc(${e.param})`],
        customRanking: [`asc(${e.param})`],
      })
      .then(() => {
        console.log("custom raking done", e.param);
      });
  });
};

const setUpIndex = (
  eCommerceId,
  eComerceDomain,
  eComerceCurrencies,
  algoliaConfig,
  locale,
  resolve,
  reject
) => {
  // se crea el index dependi del env, y se agrega a los internos
  const indexName = `${eCommerceId}_${eComerceDomain}_${locale.code}${
    enviroment == "development" ? "_dev" : ""
  }`;
  const indexTemp = client.initIndex(indexName);
  internalIndexes[
    `${eCommerceId}_${eComerceDomain}_${locale.code}`
  ] = indexTemp;
  // se generan los nombres de las replicas
  const { replicas } = algoliaConfig;
  const fullRepNames = replicas.concat(eComerceCurrencies).map((e) => {
    return { full: indexName + "_" + e, param: e };
  });
  //console.log("setting Index", fullRepNames);

  indexTemp
    .setSettings(
      Object.assign({}, algoliaConfig, {
        replicas: fullRepNames.map((e) => e.full),
      }),
      {
        forwardToReplicas: true,
      }
    )
    .then(() => {
      // se inicializa las replicas
      console.log("after init main", fullRepNames);
      createReplicaIndex(
        eCommerceId,
        eComerceDomain,
        eComerceCurrencies,
        locale,
        fullRepNames
      );
      //console.log("done settings");
      resolve(true);
    })
    .catch((err) => {
      reject(err);
    });
};

/* export const indexes = {
  // dev version of the algolia indexex for reasons
  // of time the prod indexes are of the form 'prepagos_bogota_test'
  stretch_index: client.initIndex("stretch_index"),
}; */
const createPriceFacets = (currencies) => {
  if (!currencies.length) {
    return `price.${currencies}`;
  } else {
    return currencies.map((currency) => {
      return `price.${currency}`;
    });
  }
};
const createAttributesFacets = (facets) => {
  /*   const label = facets.map((face) => {
    return `${face}.label`;
  }); */
  return facets.map((face) => {
    return face == "kInventory" ? kInventory : `${face}.value`;
  });
  // return label.concat(values);
};
//crea valriable local para le indez del eCommerce que le llega por param
// full =?
// return prommises or false
const createIndex = (eco, full = true) => {
  const {
    searchableAttributes,
    ranking,
    facets,
    currencies,
    algolia_index,
    domain,
  } = eco;
  const isDev = enviroment == "development";
  const isKlaus = domain == "idecal.com.co"; //test;
  if (algolia_index && algolia_index == true && (isDev ? isKlaus : true)) {
    const facetsCurren = createPriceFacets(currencies);
    const customFacets = createAttributesFacets(facets);
    const fullFacets = defaultFacets.concat(customFacets, facetsCurren);
    const fullSearchable = defaultsSearchableAttributes.concat(
      searchableAttributes
    );
    console.log(fullFacets, domain);
    console.log("fullFacets Search", fullFacets, fullSearchable);
    const algoliaConfig = {
      searchableAttributes: fullSearchable,
      attributeForDistinct: "slug",
      distinct: 0,
      customRanking: ranking,
      ranking: ranking,
      replicas: ["createdAt"],
      attributesForFaceting: fullFacets, //["collections_slugs", "collections_names"],
    };
    const localesMap = eco.locales.map(async (loc) => {
      //para velocidad de desarrollo se puede limitar
      if (full) {
        return new Promise((resolve, reject) => {
          setUpIndex(
            eco._id,
            eco.domain,
            eco.currencies,
            algoliaConfig,
            loc,
            resolve,
            reject
          );
        });
      } else {
        const pro = new Promise((resolve, reject) => {
          setUpIndex(
            eco._id,
            eco.domain,
            eco.currencies,
            algoliaConfig,
            loc,
            resolve,
            reject
          );
        });
      }
    });
    return Promise.all(localesMap).then((/* r */) => {
      /* console.log("localesMap", r); */
    });
  } else {
    return false;
  }
};
const INIT_ALGOLIA = (allEcommerces, full) => {
  return new Promise((resolve, reject) => {
    const promises = allEcommerces.map((eco) => {
      return createIndex(eco, full);
    });
    return Promise.all(promises).then((/* r */) => {
      resolve(true);
    });
  });
};

const indexes = (indexName) => {
  const index = internalIndexes[indexName];
  //console.log("algolia handler v0.1", Object.keys(internalIndexes), indexName);

  return index ? index : null;
};
const getAll = () => {
  return internalIndexes;
};

const getFacesNames = (facets) => {
  return facets.map((fa) => {
    return `${fa}`;
  });
};
/* for (let index in indexes) {
  indexes[index].setSettings(indexConfig(index));
  // setting setting for replicas
  client
    .initIndex(`${index}_price`)
    .setSettings({
      ranking: ["desc(price)"],
      attributesForFaceting: ["collections_slugs"],
    });
  client
    .initIndex(`${index}_name`)
    .setSettings({
      ranking: ["desc(name)"],
      attributesForFaceting: ["collections_slugs"],
    });
} */

/*prepagosBogotaIndex.setSettings(indexConfig, (err, content) => {
  console.log(content);
})*/

module.exports = {
  INIT_ALGOLIA,
  indexes,
  getAll,
  defaultFacets,
  getFacesNames,
  createAttributesFacets,
  createPriceFacets,
  createIndex,
};
