import Menu from "./components/menu";
import React from "react";

const App: React.FC = () => {
  return (
    <div className="App p-4">
      <h1 className="text-2xl font-bold mb-4">Meu App de Menu</h1>
      <Menu />
    </div>
  );
};

export default App;
