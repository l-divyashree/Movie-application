// Utility to seed sample admin shows for testing
// This would normally come from the admin panel

const seedAdminShows = () => {
  const sampleAdminShows = {
    "1": { // Dune: Part Two
      "2025-10-17": [
        {
          id: 1,
          time: "10:00 AM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 120,
          totalSeats: 150,
          price: 350,
          format: "IMAX 2D"
        },
        {
          id: 2,
          time: "01:00 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 85,
          totalSeats: 150,
          price: 350,
          format: "IMAX 2D"
        },
        {
          id: 3,
          time: "04:30 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 2 - Premium",
          availableSeats: 95,
          totalSeats: 120,
          price: 450,
          format: "Dolby Atmos"
        },
        {
          id: 4,
          time: "07:30 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 45,
          totalSeats: 150,
          price: 400,
          format: "IMAX 3D"
        },
        {
          id: 5,
          time: "10:30 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 3 - Premium",
          availableSeats: 78,
          totalSeats: 120,
          price: 450,
          format: "Dolby Atmos"
        }
      ],
      "2025-10-18": [
        {
          id: 6,
          time: "11:00 AM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 140,
          totalSeats: 150,
          price: 350,
          format: "IMAX 2D"
        },
        {
          id: 7,
          time: "02:30 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 2 - Premium",
          availableSeats: 110,
          totalSeats: 120,
          price: 450,
          format: "Dolby Atmos"
        },
        {
          id: 8,
          time: "06:00 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 65,
          totalSeats: 150,
          price: 400,
          format: "IMAX 3D"
        },
        {
          id: 9,
          time: "09:30 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 3 - Premium",
          availableSeats: 88,
          totalSeats: 120,
          price: 450,
          format: "Dolby Atmos"
        }
      ]
    },
    "2": { // Godzilla x Kong
      "2025-10-17": [
        {
          id: 10,
          time: "12:00 PM",
          venue: "CinemaFlix Standard City",
          screen: "Screen 4 - Standard",
          availableSeats: 80,
          totalSeats: 100,
          price: 300,
          format: "Standard 2D"
        },
        {
          id: 11,
          time: "03:00 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 2 - Premium",
          availableSeats: 90,
          totalSeats: 120,
          price: 400,
          format: "Dolby Atmos"
        },
        {
          id: 12,
          time: "06:30 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 55,
          totalSeats: 150,
          price: 450,
          format: "IMAX 3D"
        },
        {
          id: 13,
          time: "09:45 PM",
          venue: "CinemaFlix Standard City",
          screen: "Screen 5 - Standard",
          availableSeats: 70,
          totalSeats: 100,
          price: 300,
          format: "Standard 2D"
        }
      ]
    },
    "3": { // Deadpool & Wolverine
      "2025-10-17": [
        {
          id: 14,
          time: "11:30 AM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 2 - Premium",
          availableSeats: 100,
          totalSeats: 120,
          price: 420,
          format: "Dolby Atmos"
        },
        {
          id: 15,
          time: "02:15 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 75,
          totalSeats: 150,
          price: 480,
          format: "IMAX 2D"
        },
        {
          id: 16,
          time: "05:30 PM",
          venue: "CinemaFlix Premium Mall",
          screen: "Screen 3 - Premium",
          availableSeats: 85,
          totalSeats: 120,
          price: 420,
          format: "Dolby Atmos"
        },
        {
          id: 17,
          time: "08:45 PM",
          venue: "CinemaFlix IMAX Downtown",
          screen: "Screen 1 - IMAX",
          availableSeats: 40,
          totalSeats: 150,
          price: 480,
          format: "IMAX 2D"
        }
      ]
    }
  };

  localStorage.setItem('adminShows', JSON.stringify(sampleAdminShows));
  console.log('Admin shows seeded successfully!');
};

// Export for use in development
if (typeof window !== 'undefined') {
  window.seedAdminShows = seedAdminShows;
}

export default seedAdminShows;