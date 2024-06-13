import {
  addPhrase,
  dropPhrase,
  getAllPhrase,
  addTheme,
  getAllThemes,
  dropTheme,
  updatePhrase,
  searchAllPhrase,
  updateTheme,
} from "../../controller";

const RoutesListPost = [
  {
    route: "/add-phrase",
    function: addPhrase,
  },

  {
    route: "/add-addTheme",
    function: addTheme,
  },
  {
    route: "/update-phrase",
    function: updatePhrase,
  },

  {
    route: "/update-theme",
    function: updateTheme,
  },
];

const RoutesListGet = [
  {
    route: "/get-phrase",
    function: getAllPhrase,
  },
  {
    route: "/delete-phrase",
    function: dropPhrase,
  },
  {
    route: "/delete-theme",
    function: dropTheme,
  },
  {
    route: "/get-theme",
    function: getAllThemes,
  },

  {
    route: "/search",
    function: searchAllPhrase,
  },
];

export { RoutesListPost, RoutesListGet };
