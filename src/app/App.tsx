import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '../contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Catalog } from './pages/Catalog';
import { AIMatch } from './pages/AIMatch';
import { Profile } from './pages/Profile';
import { BookDetail } from './pages/BookDetail';
import { Exchange } from './pages/Exchange';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="book/:id" element={<BookDetail />} />

            <Route
              path="ai-match"
              element={
                <PrivateRoute>
                  <AIMatch />
                </PrivateRoute>
              }
            />
            <Route
              path="profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="exchange"
              element={
                <PrivateRoute>
                  <Exchange />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}