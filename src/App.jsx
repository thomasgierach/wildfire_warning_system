import { useState} from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import SearchForm from "./SearchForm";
import SearchResult from "./SearchResults";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchForm/>}/>
        <Route path="/results" element={<SearchResult/>}/>
      </Routes>
    </Router>
  );
};

export default App;
