const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class BookingService {
  // Get authentication token from localStorage
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Shows API
  async getShows(page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/shows?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows: ${response.statusText}`);
    }
    return response.json();
  }

  async getShowsByMovie(movieId, page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/shows/movie/${movieId}?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows for movie: ${response.statusText}`);
    }
    return response.json();
  }

  async getShowsByMovieAndCity(movieId, cityId, page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/shows/movie/${movieId}/city/${cityId}?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows: ${response.statusText}`);
    }
    return response.json();
  }

  async getShowsByDateAndCity(date, cityId, page = 0, size = 10) {
    const response = await fetch(`${API_BASE_URL}/shows/date/${date}/city/${cityId}?page=${page}&size=${size}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows: ${response.statusText}`);
    }
    return response.json();
  }

  async getShowsByVenue(venueId) {
    const response = await fetch(`${API_BASE_URL}/shows/venue/${venueId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch shows for venue: ${response.statusText}`);
    }
    return response.json();
  }

  // Venues API
  async getVenues() {
    const response = await fetch(`${API_BASE_URL}/venues`);
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }
    return response.json();
  }

  async getVenuesByCity(cityId) {
    const response = await fetch(`${API_BASE_URL}/venues/city/${cityId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch venues: ${response.statusText}`);
    }
    return response.json();
  }

  // Seats API
  async getSeatsByShow(showId) {
    const response = await fetch(`${API_BASE_URL}/seats/show/${showId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seats: ${response.statusText}`);
    }
    return response.json();
  }

  async getSeatAvailability(showId) {
    const response = await fetch(`${API_BASE_URL}/seats/show/${showId}/availability`);
    if (!response.ok) {
      throw new Error(`Failed to fetch seat availability: ${response.statusText}`);
    }
    return response.json();
  }

  async blockSeats(seatIds, showId) {
    const response = await fetch(`${API_BASE_URL}/seats/block`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ seatIds, showId })
    });
    if (!response.ok) {
      throw new Error(`Failed to block seats: ${response.statusText}`);
    }
    return response.json();
  }

  async unblockSeats(seatIds, showId) {
    const response = await fetch(`${API_BASE_URL}/seats/unblock`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ seatIds, showId })
    });
    if (!response.ok) {
      throw new Error(`Failed to unblock seats: ${response.statusText}`);
    }
    return response.json();
  }

  // Bookings API
  async createBooking(bookingData) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) {
      throw new Error(`Failed to create booking: ${response.statusText}`);
    }
    return response.json();
  }

  async getUserBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user bookings: ${response.statusText}`);
    }
    return response.json();
  }

  async getBookingById(bookingId) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch booking: ${response.statusText}`);
    }
    return response.json();
  }

  async cancelBooking(bookingId) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: this.getAuthHeaders()
    });
    if (!response.ok) {
      throw new Error(`Failed to cancel booking: ${response.statusText}`);
    }
    return response.json();
  }

  // Cities API (assuming this exists based on backend structure)
  async getCities() {
    const response = await fetch(`${API_BASE_URL}/cities`);
    if (!response.ok) {
      throw new Error(`Failed to fetch cities: ${response.statusText}`);
    }
    return response.json();
  }
}

export default new BookingService();