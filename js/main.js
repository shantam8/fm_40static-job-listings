let mainJobItemList = document.getElementById("mainJobItemList");
let btnClearAllFilters = document.querySelector("#btnClearAllFilters");
let filterBox = document.getElementById("filterBox");
let filterItems = document.getElementById("filterItems");
let tagItems = document.getElementsByClassName["tagItem"];
let filterArray = [];
let data;

function updateShownItems() {
  for (let i = 0; i < mainJobItemList.childElementCount; i++) {
    mainJobItemList.childNodes[i].classList.remove("displayNone");
  }

  if (filterArray.length == 0) {
    return;
  }

  for (let i = 0; i < mainJobItemList.childElementCount; i++) {
    //loop through jobitems
    let jobItemTags =
      mainJobItemList.childNodes[i].getElementsByClassName("tagItem");

    for (let filterItem = 0; filterItem < filterArray.length; filterItem++) {
      // loop through filterarray
      let itemHasTag = false;

      for (let j = 0; j < jobItemTags.length; j++) {
        // loop through single tags of one jobitem

        if (jobItemTags[j].textContent == filterArray[filterItem]) {
          itemHasTag = true;
          break;
        }
      }
      if (!itemHasTag) {
        mainJobItemList.childNodes[i].classList.add("displayNone");
      }
    }
  }
}

function removeAllFilters() {
  filterArray = [];
  while (filterItems.hasChildNodes()) {
    filterItems.removeChild(filterItems.childNodes[0]);
  }
  filterBox.style.display = "none";
  updateShownItems();
}

function handleRemoveFilter(event) {
  filterArray.splice(
    filterArray.indexOf(event.target.previousSibling.textContent),
    1
  );
  event.target.parentElement.remove();
  if (filterArray.length == 0) {
    filterBox.style.display = "none";
  }
  updateShownItems();
}

function handleAddFilterClick(event) {
  if (filterArray.indexOf(event.target.textContent) > -1) {
    return;
  }
  filterArray.push(event.target.textContent);
  if (filterArray.length == 1) {
    filterBox.style.display = "flex";
  }

  let newElementFilter = createCompleteElement("div", "filterItem");

  let p = createCompleteElement("p", "filterText");
  p.innerText = event.target.textContent;
  newElementFilter.appendChild(p);

  let btn = createCompleteElement("button", "btnRemoveFilterItem");
  btn.addEventListener("click", handleRemoveFilter);
  newElementFilter.appendChild(btn);

  filterItems.appendChild(newElementFilter);
  updateShownItems();
}

function createCompleteElement(tag, ...classes) {
  let newTempElement = document.createElement(tag);
  classes.forEach((element) => {
    newTempElement.classList.add(element);
  });
  return newTempElement;
}

function createJobList() {
  data.forEach((element) => {
    let newElementJobItem = createCompleteElement("div", "jobItem", "itemBox");

    //add left border on featured
    if (element.featured) {
      newElementJobItem.appendChild(
        createCompleteElement("div", "itemFeatured")
      );
    }

    //add descriptionbox
    let newElementJobDescription = createCompleteElement(
      "div",
      "jobDescriptionBox"
    );

    newElementJobLogo = createCompleteElement("img", "jobCompanyLogo");
    newElementJobLogo.setAttribute("src", element.logo);
    newElementJobDescription.appendChild(newElementJobLogo);

    let h2 = createCompleteElement("h2", "jobCompany");
    h2.innerText = element.company;
    newElementJobDescription.appendChild(h2);

    if (element.new) {
      h2 = createCompleteElement("h2", "tagNew");
      h2.innerText = "New!";
      newElementJobDescription.appendChild(h2);
    }

    if (element.featured) {
      h2 = createCompleteElement("h2", "tagFeatured");
      h2.innerText = "Featured";
      newElementJobDescription.appendChild(h2);
    }

    let h1 = createCompleteElement("h1", "jobTitle");
    h1.innerText = element.position;
    newElementJobDescription.appendChild(h1);

    let p = createCompleteElement("p");

    let span = createCompleteElement("span", "jobAge");
    span.innerText = element.postedAt;
    p.appendChild(span);

    span = createCompleteElement("span", "dot");
    span.innerHTML = "&bull;";
    p.appendChild(span);

    span = createCompleteElement("span", "jobTimeModel");
    span.innerText = element.contract;
    p.appendChild(span);

    span = createCompleteElement("span", "dot");
    span.innerHTML = "&bull;";
    p.appendChild(span);

    span = createCompleteElement("span", "jobPlace");
    span.innerText = element.location;
    p.appendChild(span);

    newElementJobDescription.appendChild(p);
    newElementJobItem.appendChild(newElementJobDescription);

    //addTags
    let newElementTags = createCompleteElement("div", "tags");

    let newElementTagRole = createCompleteElement("button", "tagItem");
    newElementTagRole.innerText = element.role;
    newElementTagRole.addEventListener("click", handleAddFilterClick);
    newElementTags.appendChild(newElementTagRole);

    let newElementTagLevel = createCompleteElement("button", "tagItem");
    newElementTagLevel.innerText = element.level;
    newElementTagLevel.addEventListener("click", handleAddFilterClick);
    newElementTags.appendChild(newElementTagLevel);

    element.languages.forEach((language) => {
      let newElementTagLanguage = createCompleteElement("button", "tagItem");
      newElementTagLanguage.innerText = language;
      newElementTagLanguage.addEventListener("click", handleAddFilterClick);
      newElementTags.appendChild(newElementTagLanguage);
    });

    element.tools.forEach((tool) => {
      let newElementTagTool = createCompleteElement("button", "tagItem");
      newElementTagTool.innerText = tool;
      newElementTagTool.addEventListener("click", handleAddFilterClick);
      newElementTags.appendChild(newElementTagTool);
    });

    newElementJobItem.appendChild(newElementTags);

    mainJobItemList.appendChild(newElementJobItem);
  });
}

function loadJson() {
  let xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType("application/JSON");
  xhttp.open("GET", "../data.json", true);
  xhttp.onreadystatechange = () => {
    if (xhttp.readyState == 4 && xhttp.status == "200") {
      let tempData = xhttp.responseText;
      data = JSON.parse(tempData);
      createJobList();
    }
  };
  xhttp.send();
}

function init() {
  loadJson();
  btnClearAllFilters.addEventListener("click", removeAllFilters);
}

window.onload = init();
