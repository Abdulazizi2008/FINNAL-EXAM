import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Coins from "./pages/Coins";
import SinglePage from "./pages/SinglePage";
import { Context } from "./context";
import { useReducer, useState } from "react";
import reducer, { initialState } from "./store/reducer";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currency, setCurrency] = useState("USD");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Context.Provider value={{ state, dispatch }}>
      <Router>
        <Header
          currency={currency}
          setCurrency={setCurrency}
          setIsOpen={setIsOpen}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Coins
                currency={currency}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            }
          />
          <Route path="/coins/:id" element={<SinglePage />} />
        </Routes>
      </Router>
    </Context.Provider>
  );
}

export default App;
