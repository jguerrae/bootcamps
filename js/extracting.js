function arrayFromHtml(elems) {
  //console.log(elems);
  tLine = "[";
  for (let i = 0; i < elems.length; i++) {
    const temp = elems[i];
    tLine += "'" + temp.innerHTML + "'";
    if (elems.length - 1 == i) {
      tLine += "]";
    } else {
      tLine += ",";
    }
  }
  return tLine;
}
function datesFromHtml(elems) {
  tLine = "";
  if (elems) {
    const times = elems.getElementsByTagName("time");
    //console.log(times);
    const start = times && times.length && times[0] ? times[0].innerHTML : "";
    const end = times && times.length && times[1] ? times[1].innerHTML : "";
    tLine += "'start': '" + start + "', ";
    tLine += "'end': '" + end + "'";
    //console.log(tLine);
  }
  return tLine;
}
function getEducation() {
  // education-section section id
  const sectio = document.getElementById("education-section");
  const ul = sectio.getElementsByTagName("ul")[0];
  const lists = ul.children;
  let TotalLine = "[";
  for (let i = 0; i < lists.length; i++) {
    let line = "{";
    //console.log("forr", i, lists, typeof lists[0].getElementsByClassName);
    const temp = lists[i];

    const eduOrg = temp.getElementsByClassName("pv-entity__school-name")[0]
      .innerHTML;
    const titles = temp.getElementsByClassName("pv-entity__comma-item");
    const times = temp.getElementsByClassName("pv-entity__dates")[0];

    line += "'education_org': '" + eduOrg + "',";
    line += "'degrees': " + arrayFromHtml(titles) + ",";
    line += datesFromHtml(times);
    //console.log("edu times", datesFromHtml(times));

    if (lists.length - 1 == i) {
      TotalLine += line + "}]";
    } else {
      TotalLine += line + "},";
    }
  }

  // pv-entity__school-name h3

  //console.log("after", TotalLine);
  return TotalLine;
}
function getJobTitle() {
  const parent = document.getElementsByClassName(
    "pv-text-details__left-panel"
  )[0];
  const title = parent.getElementsByClassName("text-body-medium");
  //console.log("titiel", title[0].innerHTML);
  return "'" + title[0].innerHTML + "'";
}

function getJobHistory() {
  // id block experience-section section
  const sectio = document.getElementById("experience-section");
  const ul = sectio.getElementsByTagName("ul")[0];
  const lists = ul.children;
  let TotalLine = "[";
  for (let i = 0; i < lists.length; i++) {
    const temp = lists[i];
    let line = "";
    // puede tener multiples cargos en la misma empresa
    //console.log(temp, lists.length, temp.getElementsByTagName("ul"));
    if (
      temp.getElementsByTagName("ul") &&
      temp.getElementsByTagName("ul").length > 0
    ) {
      const full = temp.getElementsByTagName("ul")[0];

      const infoCompany = temp.getElementsByClassName(
        "pv-entity__company-summary-info"
      )[0].children[0].children[1].innerHTML;
      const nLists = full.children;
      for (let i = 0; i < nLists.length; i++) {
        // line
        line += "{";
        // console.log("nLists", infoCompany, nLists[i]);
        const listT = nLists[i];
        const info = listT.getElementsByClassName(
          "pv-entity__summary-info-v2"
        )[0];
        const ranges = info
          .getElementsByClassName("pv-entity__date-range")[0]
          .children[1].innerHTML.split(" – ");
        const jobTitle =
          info.getElementsByTagName("h3")[0].children[1].innerHTML;
        line += "'job_title': '" + jobTitle + "', ";
        line += "'company_name': '" + infoCompany + "', ";
        line += "'start': '" + ranges[0] + "', ";
        line += "'end': '" + ranges[1] + "' ";
        //console.log("after", !(nLists.length - 1 == i), nLists.length, i);
        if (!(nLists.length - 1 == i)) {
          line += "},";
        }
      }
    } else {
      line = "{";
      const section = temp.getElementsByTagName("section")[0];
      const info = section.getElementsByClassName("pv-entity__summary-info")[0];
      // console.log("forr", i, section, info);
      const jobTitle = info.getElementsByTagName("h3")[0].innerHTML;
      const company_name = info.getElementsByClassName(
        "pv-entity__secondary-title"
      )[0].innerHTML;
      const ranges = info
        .getElementsByClassName("pv-entity__date-range")[0]
        .children[1].innerHTML.split(" – ");
      //console.log(company_name, ranges);
      line += "'job_title': '" + jobTitle + "', ";
      line += "'company_name': '" + company_name + "', ";
      line += "'start': '" + ranges[0] + "', ";
      line += "'end': '" + ranges[1] + "' ";
      /*      const eduOrg = temp.getElementsByClassName("pv-entity__school-name")[0]
        .innerHTML;


        pv-entity__summary-info--background-section
      const titles = temp.getElementsByClassName("pv-entity__comma-item");
      const times = temp.getElementsByClassName("pv-entity__dates")[0];

      line += "'education_org': '" + eduOrg + "',";
      line += "'degrees': " + arrayFromHtml(titles) + ",";
      line += datesFromHtml(times); */
    }
    //console.log("finished I", i);
    if (lists.length - 1 == i) {
      TotalLine += line + "}]";
    } else {
      TotalLine += line + "},";
    }
  }

  // pv-entity__school-name h3
  return TotalLine;
}
function makeLine() {
  console.log(getEducation() + "," + getJobTitle() + "," + getJobHistory());
}
makeLine();
