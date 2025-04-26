export const getColorClassForNutrient = (type) => {
    switch (type) {
      case "calories":
        return "bg-warning"; // jaune
      case "proteins":
        return "bg-pink"; // rose
      case "carbs":
        return "bg-info"; // bleu
      case "fats":
        return "bg-success"; // vert
      default:
        return "bg-secondary";
    }
  };
  
  export const getLabelForNutrient = (type) => {
    switch (type) {
      case "calories":
        return "Kcal";
      case "proteins":
        return "P"; // protéines
      case "carbs":
        return "G"; // glucides
      case "fats":
        return "L"; // lipides
      default:
        return "";
    }
  };
  