import { AdminPage } from './AdminPage';
import './App.css'
import { ReservationPage } from './ReservationPage'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" Component={ReservationPage} />
        <Route path="/admin" Component={AdminPage} />
      </Routes>
  </Router>
);
}

export default App
