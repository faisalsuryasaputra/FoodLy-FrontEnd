import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import FoodCard from "../components/FoodCard";
import axios from "axios";
import { useRecipe } from "../hooks/useRecipe";
import whiteMyRecipe from "../assets/whiteMyRecipe.svg"

export default function MyRecipesPage() {
  const { myRecipesList, formatDate } = useRecipe()
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="bg-light min-vh-100 pt-5 pb-5">
      <div className="container">

        {/* BAGIAN HEADER */}
        <div className="d-flex align-items-center gap-4 mb-5">
          <div
            className="d-flex justify-content-center align-items-center rounded-circle shadow-sm"
            style={{ width: "70px", height: "70px", backgroundColor: "#ff471a", flexShrink: 0 }}
          >
            <img src={whiteMyRecipe} alt="MyRecipeIcon" />
          </div>

          <div>
            <h1 className="fw-bold m-0" style={{ fontSize: "2.5rem", color: "#1a1a1a" }}>
              Resep Anda
            </h1>
            <p className="text-secondary fs-6 m-0 mt-1">
              {myRecipesList.length} resep yang telah anda buat
            </p>
          </div>
        </div>


        <div className="row gy-4">
          {myRecipesList.length > 0 ? (
            myRecipesList.map(recipe => (
              <div className="col-4" key={recipe.id}>
                <FoodCard
                  id={recipe.id}
                  image={recipe.image}
                  name={recipe.title}
                  userName={recipe.user.name}
                  calCount={recipe.calories}
                  likeCount={recipe.likes_count}
                  initialIsLiked={recipe.is_liked}
                  date={formatDate(recipe.created_at)}
                />
              </div>
            ))
          ) : (
            // TAMPILAN KETIKA KOSONG 
            <div className="col-12 text-center mt-5">
              <h4 className="text-secondary">Anda belum pernah membuat resep</h4>
              <p className="text-muted">Ayo share resep Anda ke dunia</p>
            </div>
          )}
        </div>


      </div>
    </div>
  );
}