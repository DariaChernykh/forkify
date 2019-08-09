import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {

};
const controlSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);
        searchView.clearRecipes();
        renderLoader(elements.searchRes);

        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderRecipes(state.search.result);
            searchView.clearInput();
        } catch (e) {
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if (btn) {
        const doToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearRecipes();
        searchView.renderRecipes(state.search.result, doToPage);
    }
});

const controlRecipe = async () => {

    const id = window.location.hash.replace('#', '');

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            console.log(1);
            state.recipe.calcTime();
            state.recipe.calcServings();
            console.log(2);

            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (e) {
            // console.log(e);
        }
    }
};

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
