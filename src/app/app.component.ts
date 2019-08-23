import { Component, OnInit } from "@angular/core";
import { DataService } from "./service/data.service";
import { Recipe } from "./recipe.model";
import { PagerService } from "./service/pager.service";
import { ActivatedRoute, Params } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  inputSearchQuery: string = "";
  userRecipes: Recipe[] = [];
  userRecipeData: any[] = [];
  loader: boolean = false;

  ///pager object
  pager: any = {};

  // paged items
  pagedItems: any[];
  id: string;
  /* ingredients of recipes */
  ingredients: any;
  constructor(
    private dataService: DataService,
    private pagerService: PagerService,
    private route: ActivatedRoute
  ) {
    console.log(this.inputSearchQuery);
  }
  ngOnInit() {
    this.route.queryParams
      .pipe(filter(params => params.id))
      .subscribe(params => {
        console.log(params);
        this.id = params.id;
        console.log(this.id);
      });
  }

  async submit(formdata) {
    console.log(formdata.inputSearchQuery);
    this.loader = true;
    await this.dataService
      .getRecipeOnSearch(formdata.inputSearchQuery)
      .subscribe(
        posts => {
          this.userRecipes = posts;
          console.log(this.userRecipes);
          this.inputSearchQuery = "";
          this.loader = false;
          this.setPage(1);
        },
        err => {
          console.log(err.message);
        }
      );
  }

  setPage(page: number) {
    // get pager object from service
    this.pager = this.pagerService.getPager(this.userRecipes.length, page);

    // get current page of items
    this.pagedItems = this.userRecipes.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );
  }

  async recipesData() {
    //const id = window.location.hash;
    console.log(this.id);
    await this.dataService.getAllRecipes(this.id).subscribe(response => {
      console.log(response);
      // console.log(this.userRecipeData.push(response.this.parseIngredients()));
      this.userRecipeData.push(response);
      const responsedata = response.ingredients;
      responsedata.replace(this.parseIngredients());
      // responsedata.stringify(this.parseIngredients());
      //  this. ingredients = response.ingredients;
      //  console.log(this.ingredients);
      // console.log(JSON.parse(response));
      // console.log(response.ingredients.this.parseIngredients());

      // console.log(response.stringify(this.parseIngredients()));
    });
  }

  parseIngredients() {
    this.dataService.getAllRecipes(this.id).subscribe(response => {
      console.log(response);
      this.ingredients = response.ingredients;
      console.log(this.ingredients);

      console.log(this.ingredients);
      const unitsLong = [
        "tablespoons",
        "tablespoon",
        "ounces",
        "ounce",
        "teaspoons",
        "teaspoon",
        "cups",
        "pounds"
      ];
      const unitShort = [
        "tbsp",
        "tbsp",
        "oz",
        "oz",
        "tsp",
        "tsp",
        "cup",
        "pound"
      ];
      const newIngredients = this.ingredients.map(el => {
        // 1) uniform units
        let ingredient = el.toLowerCase();
        unitsLong.forEach((unit, i) => {
          ingredient = ingredient.replace(unit, unitShort[i]);
        });

        //2) Remove parentheses
        ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
        //  / *\([^)]*\) */g this patterns are called regular expressions regular expression mdn  | javascript remove pareenthesis

        // 3) Parse ingridients inot count, unit and ingreients
        const arrIng = ingredient.split(" ");
        const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));

        let objInt;
        if (unitIndex > -1) {
          // there is a unit
          // ex 4 1/2 cups, arCount is [4, 1/2]
          // ex 4 cups, arrCount is [4]
          const arrCount = arrIng.slice(0, unitIndex);

          let count;
          if (arrCount.length === 1) {
            count = eval(arrIng[0].replace("-", "+"));
          } else {
            count = eval(arrIng.slice(0, unitIndex).join("+"));
          }
          objInt = {
            count,
            unit: arrIng[unitIndex],
            ingredient: arrIng.slice(unitIndex + 1).join(" ")
          };
        } else if (parseInt(arrIng[0], 10)) {
          //there is no unit , but 1st elemnt is number
          objInt = {
            count: parseInt(arrIng[0], 10),
            unit: "",
            ingredient: arrIng.slice(1).join(" ")
          };
        } else if (unitIndex === -1) {
          // there is No unit and no number in 1st position
          objInt = {
            count: 1,
            unit: "",
            ingredient
          };
        }

        return objInt;
      });
      this.ingredients = newIngredients;
    });
  }
}
