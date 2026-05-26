import { useEffect, useState, useCallback } from "react"
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

  // Kita bungkus dengan useCallback agar aman dari infinite loop
  const fetchAllRecipes = useCallback(async () => {
    try {
      const [terbaruData, topData, myData] = await Promise.all([
        getRecipes(),
        getTopRecipes(),
        getMyRecipes()
      ]);
      setRecipeTerbaru(terbaruData);
      setTopRecipes(topData);
      setMyRecipes(myData);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    }
  }, []);

  async function searchForRecipes(nameOfRecipe, kategoriSearch, sortSearch) {
    try {
      const data = await searchRecipes(nameOfRecipe, kategoriSearch.toLowerCase(), sortSearch.toLowerCase())
      setRecipeSearchResult(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Hanya jalankan otomatis saat hook pertama kali dipanggil
  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);

  return { 
    recipeTerbaru, 
    formatDate, 
    recipeSearchResult, 
    searchForRecipes, 
    topRecipes, 
    myRecipesList,
    fetchAllRecipes // <--- KUNCI PERBAIKAN: Ekspos fungsi ini!
  }
}