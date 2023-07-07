import * as model from './Model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipieView from './Views/recipieView.js';
import searchView from './Views/searchView.js';
import resultView from './Views/resultView.js';
import PaginationView from './Views/PaginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipieView from './Views/addRecipieView.js';
// import icons from '../img/icons.svg';
import icons from 'url:../img/icons.svg';
import 'core-js/stable'; //pollifilling everything
import 'regenerator-runtime'; //polyfilling async and await

// if (module.hot) {
//   module.hot.accept();
// }
const ControlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipieView.renderSpinner();
    //results view to mark selected search result
    resultView.update(model.getSearchResultsPage());
    //1)Loading recipie
    await model.loadRecipe(id);

    //2)rendering recipie
    recipieView.render(model.state.recipe);
    //updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipieView.renderError();
    console.error(err);
  }
};

const ControlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //1)get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) load search
    await model.loadSearchResults(query);
    //3)render results
    // resultView.render(model.state.search.results);
    resultView.render(model.getSearchResultsPage());
    //render initial pagination buttons
    PaginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const ControlPagination = function (goToPage) {
  //1)render results
  // resultView.render(model.state.search.results);
  resultView.render(model.getSearchResultsPage(goToPage));
  //2)render initial pagination buttons
  PaginationView.render(model.state.search);
};

const ControlServings = function (newServings) {
  //update the recipe servings (in the state )
  model.updateServings(newServings);

  //Update the view
  // recipieView.render(model.state.recipe);
  recipieView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //Add or remove bookmark
  if (!model.state.recipe.bookmarked) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }
  //Update recipie view
  recipieView.update(model.state.recipe);
  //Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //show loading
    addRecipieView.renderSpinner();

    //upload the new recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render recipe
    recipieView.render(model.state.recipe);

    //success message
    addRecipieView.renderMessage();

    //Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //chage ID in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back()

    //close form window
    setTimeout(function () {
      addRecipieView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipieView.renderError(err.message);
  }
};

const functionTest = function () {
  console.log('hey welcome');
};
const init = function () {
  bookmarksView.addHandlerBookmarks(controlBookmark);
  recipieView.addHandlerRender(ControlRecipies);
  recipieView.addHandlerUpdateServings(ControlServings);
  recipieView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(ControlSearchResults);
  PaginationView.addHandlerClick(ControlPagination);
  addRecipieView.addHandlerUpload(controlAddRecipe);
  functionTest();
};
init();
