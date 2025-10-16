const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class MovieService {
  // Public endpoints - no authentication required
  async getMovies(filters = {}) {
    const params = new URLSearchParams();
    
    if (filters.search) params.append('search', filters.search);
    if (filters.genre) params.append('genre', filters.genre);
    if (filters.language) params.append('language', filters.language);
    if (filters.rating) params.append('rating', filters.rating);
    if (filters.nowShowing !== undefined) params.append('nowShowing', filters.nowShowing);
    if (filters.comingSoon !== undefined) params.append('comingSoon', filters.comingSoon);
    if (filters.page !== undefined) params.append('page', filters.page);
    if (filters.size !== undefined) params.append('size', filters.size);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortDirection) params.append('sortDirection', filters.sortDirection);

    const response = await fetch(`${API_BASE_URL}/public/movies?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies: ${response.statusText}`);
    }
    return response.json();
  }

  async getMovieById(id) {
    const response = await fetch(`${API_BASE_URL}/public/movies/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movie: ${response.statusText}`);
    }
    return response.json();
  }

  async getGenres() {
    const response = await fetch(`${API_BASE_URL}/public/movies/genres`);
    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.statusText}`);
    }
    return response.json();
  }

  async getLanguages() {
    const response = await fetch(`${API_BASE_URL}/public/movies/languages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch languages: ${response.statusText}`);
    }
    return response.json();
  }

  async searchMovies(query, page = 0, size = 20) {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString()
    });

    const response = await fetch(`${API_BASE_URL}/public/movies/search?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to search movies: ${response.statusText}`);
    }
    return response.json();
  }

  // Admin endpoints - require authentication
  async createMovie(movieData, token) {
    const response = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create movie: ${response.statusText}`);
    }
    return response.json();
  }

  async updateMovie(id, movieData, token) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(movieData)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update movie: ${response.statusText}`);
    }
    return response.json();
  }

  async deleteMovie(id, token) {
    const response = await fetch(`${API_BASE_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete movie: ${response.statusText}`);
    }
    return response.json();
  }

  async getMovieStats(token) {
    const response = await fetch(`${API_BASE_URL}/movies/stats/total`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch movie stats: ${response.statusText}`);
    }
    return response.json();
  }
}

const movieService = new MovieService();
export default movieService;