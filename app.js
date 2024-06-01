const searchField = document.getElementById("search_field");
const searchSubmitbtn = document.getElementById("search_submit_btn");
const playerDisplayContainer = document.getElementById(
  "player__display__container"
);
const emptySearchError = document.getElementById(
  "empty_search_error"
);
const wrongSearchError = document.getElementById(
  "wrong_search_error"
);
const limitError = document.getElementById("limit_error");
const modal = document.getElementById("modal");
const modalContainer = document.getElementById("modal_body");
const groupListCount = document.getElementById("group_list_count");
const groupListContent = document.getElementById(
  "group_list_content"
);

let groupList = [];

const fetchInitialData = async () => {
  const res = await fetch(
    "https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p="
  );
  const { player } = await res.json();

  displayData(player);
};

const fetchDataBySearch = async (searchedTerm) => {
  const res = await fetch(
    `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${searchedTerm}`
  );
  const { player } = await res.json();

  displayData(player);
};

const generateCard = (data) => {
  const card = `
    <div class="col-lg-4 col-md-6 col-sm-12">
      <div class="card text-bg-secondary mb-3">
        <img src="${
          data.strThumb ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQABqQIdskCD9BK0I81EbVfV9tTz320XvJ35A&s"
        }" class="card-img-top" alt="player image" />
        <div class="card-body">
          <h5 class="card-title">Name: ${data.strPlayer}</h5>
          <p class="mb-1">Sports: ${data.strSport}</p>
          <p class="mb-1">Nationality: ${data.strNationality}</p>
          <p class="mb-1">Team: ${data.strTeam}</p>
          <p class="mb-1">Gender: ${data.strGender}</p>
          <p class="my-2 fst-italic">${data?.strDescriptionEN?.slice(
            0,
            50
          )}...</p>
          <p>
            <a class="text-white fs-3 mx-2" href="${
              data.strFacebook
            }" target="_blank"><i class="fa-brands fa-facebook"></i></a>
            <a class="text-white fs-3 mx-2" href="${
              data.strTwitter
            }" target="_blank"><i class="fa-brands fa-twitter"></i></a>
            <a class="text-white fs-3 mx-2" href="${
              data.strInstagram
            }" target="_blank"><i class="fa-brands fa-instagram"></i></a>
          </p>
          <div class="d-flex flex-column g-2">
            <button onclick="handleShowDetail(${
              data.idPlayer
            })" class="btn btn-success mb-2">
              See detail
            </button>
            <button onclick='handleAddToGroup("${
              data.strPlayer
            }")' class="btn btn-success">
              Add to group
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  return card;
};

const displayData = (players) => {
  if (players) {
    const cardGeneratedPlayersList = players.map((player) => {
      return generateCard(player);
    });

    playerDisplayContainer.innerHTML =
      cardGeneratedPlayersList.join("");
  } else {
    wrongSearchError.classList.remove("d-none");
    wrongSearchError.classList.add("d-block");
  }
};

searchSubmitbtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchedTerm = searchField.value;

  if (!searchedTerm) {
    emptySearchError.classList.remove("d-none");
    emptySearchError.classList.add("d-block");
    return;
  }

  fetchDataBySearch(searchedTerm);
  searchField.value = "";
});

const generateModalData = (data) => {
  const body = `
    <img src="${
      data.strThumb ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQABqQIdskCD9BK0I81EbVfV9tTz320XvJ35A&s"
    }" class="img-fluid w-100" alt="player image">
    <h3 class="my-3">Name: ${data.strPlayer}</h3>
    <p class="mb-1">Sports: ${data.strSport}</p>
          <p class="mb-1">Nationality: ${data.strNationality}</p>
          <p class="mb-1">Team: ${data.strTeam}</p>
          <p class="mb-1">Gender: ${data.strGender}</p>
          <p class="mb-1">Born date: ${data.dateBorn}</p>
          <p class="mb-1">Location: ${data.strBirthLocation}</p>
          <p class="mb-1">Status: ${
            data.strStatus ? data.strStatus : "Inactive"
          }</p>
          <p class="my-2 fst-italic">Description: ${
            data?.strDescriptionEN
          }</p>
  `;

  return body;
};

const handleShowDetail = async (id) => {
  modal.classList.add("d-block");
  modal.classList.remove("d-none");

  const res = await fetch(`
  https://www.thesportsdb.com/api/v1/json/3/lookupplayer.php?id=${id.toString()}`);
  const { players } = await res.json();
  const data = players[0];

  const modalBody = generateModalData(data);
  modalContainer.innerHTML = modalBody;
};

const handleAddToGroup = (data) => {
  if (groupList.length < 11) {
    groupList.push(data);
    updateGroupListCount();
    updateGroupList();
    console.log(groupList);
  } else {
    limitError.classList.add("d-block");
    limitError.classList.remove("d-none");
  }
};

const updateGroupListCount = () => {
  groupListCount.innerText = groupList.length;
};

const updateGroupList = () => {
  const mappedList = groupList.map((item) => {
    return `
    <li
    onclick="removeGroupList('${item}')"
    class="list-group-item border-0 bg-secondary text-white">
      ${item}
    </li>
    `;
  });

  groupListContent.innerHTML = mappedList.join("");
};

const removeGroupList = (name) => {
  const filteredList = groupList.filter((item) => item !== name);

  groupList = filteredList;
  updateGroupList()
  updateGroupListCount();
};

fetchInitialData();

const handleAlertClose = () => {
  emptySearchError.classList.remove("d-block");
  emptySearchError.classList.add("d-none");
  wrongSearchError.classList.remove("d-block");
  wrongSearchError.classList.add("d-none");
  limitError.classList.remove("d-block");
  limitError.classList.add("d-none");
};

const handleModalClose = () => {
  modal.classList.add("d-none");
  modal.classList.remove("d-block");
};

/* 
  name
  nationality
  team
  description(10 word)
  gender
  img
  social media

*/
