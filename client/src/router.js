import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./components/Login";

function router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<h1>Weocome to Homepage</h1>} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </BrowserRouter>
    )
}

export default router;