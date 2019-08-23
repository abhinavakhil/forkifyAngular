import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Recipe } from "../recipe.model";

@Injectable({
  providedIn: "root"
})
export class DataService {
  //apikey:string = '85dbe8754cf3d00802206e21ac60cbb8';
  apikey: string = "9448f4d97a35d6608705fab965577ca4";
  //apikey:string = '2e493bde589c5a3f9278e4047c19744d';

  constructor(private http: HttpClient) {}

  //search request

  getRecipeOnSearch(query) {
    return this.http
      .get<Recipe[]>(
        `https://www.food2fork.com/api/search?key=${this.apikey}&q=${query}`
      )
      .pipe(
        map((response: any) => {
          return response.recipes;
        })
      );
  }

  //getting recipes
  getAllRecipes(id) {
    return this.http
      .get(`https://www.food2fork.com/api/get?key=${this.apikey}&rId=${id}`)
      .pipe(
        map((response: any) => {
          return response.recipe;
        })
      );
  }

  ////
}
