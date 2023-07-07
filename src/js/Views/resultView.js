import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipies found. Please try again!';
  #message = '';

  _generateMarkup() {
    console.log(this._data);

    return this._data.map(result=>previewView.render(result,false)).join('');
  }

}

export default new ResultView();
