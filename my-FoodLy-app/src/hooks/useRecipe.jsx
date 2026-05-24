import { useEffect, useState } from "react"
import { getRecipes } from "../services/ApiService"
import { searchRecipes } from "../services/ApiService"
import { getTopRecipes } from "../services/ApiService"
import { getMyRecipes } from "../services/ApiService"

export function useRecipe() {

  const formatDate = (dateString) => {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  const [recipeTerbaru, setRecipeTerbaru] = useState([])
  const [recipeSearchResult, setRecipeSearchResult] = useState([])
  const [topRecipes, setTopRecipes] = useState([])
  const [myRecipesList, setMyRecipes] = useState([])


  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRecipes()
        setRecipeTerbaru(data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [])

  async function searchForRecipes(nameOfRecipe, kategoriSearch, sortSearch) {
    try {
      const data = await searchRecipes(nameOfRecipe, kategoriSearch.toLowerCase(), sortSearch.toLowerCase())
      setRecipeSearchResult(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function getTop5Recipes() {
    try {
      const data = await getTopRecipes()
      setTopRecipes(data)
    } catch (error) {
      console.error(error)
    }
  }

  async function myRecipes() {
    try {
      const data = await getMyRecipes()
      setMyRecipes(data)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTop5Recipes()
  }, [])

  useEffect(() => {
    getMyRecipes()
  }, [])

  return { recipeTerbaru, formatDate, recipeSearchResult, searchForRecipes, topRecipes, myRecipesList }
}