import React, { useState, useEffect } from 'react';
import { PencilIcon } from '@heroicons/react/24/outline';
import adminService from '../../services/adminService';

const AdminSeatManagement = () => {
  const [venues, setVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState('');
  const [seatLayout, setSeatLayout] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState({
    rows: 10,
    seatsPerRow: 15,
    aisleAfterSeat: [5, 10], // Aisle positions
    premiumRows: [1, 2], // Premium/VIP rows
    disabledSeats: [] // Array of {row, seat} objects
  });

  useEffect(() => {
    loadVenues();
  }, []);

  useEffect(() => {
    if (selectedVenue) {
      loadScreensForVenue(selectedVenue);
    }
  }, [selectedVenue]);

  useEffect(() => {
    if (selectedScreen) {
      loadSeatLayout(selectedScreen);
    }
  }, [selectedScreen]);

  const loadVenues = async () => {
    try {
      const data = await adminService.getVenues();
      setVenues(data || []);
    } catch (err) {
      setError('Failed to load venues: ' + err.message);
    }
  };

  const loadScreensForVenue = async (venueId) => {
    try {
      setLoading(true);
      // Mock screens for now - replace with actual API call
      const mockScreens = [
        { id: 1, name: 'Screen 1', capacity: 150, venueId: parseInt(venueId) },
        { id: 2, name: 'Screen 2', capacity: 200, venueId: parseInt(venueId) },
        { id: 3, name: 'Screen 3', capacity: 100, venueId: parseInt(venueId) }
      ];
      setScreens(mockScreens);
    } catch (err) {
      setError('Failed to load screens: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSeatLayout = async (screenId) => {
    try {
      setLoading(true);
      // Generate mock seat layout - replace with actual API call
      generateSeatLayout(layoutConfig);
    } catch (err) {
      setError('Failed to load seat layout: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSeatLayout = (config) => {
    const layout = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];
    
    for (let i = 0; i < config.rows; i++) {
      const row = [];
      const rowLetter = rows[i];
      
      for (let j = 1; j <= config.seatsPerRow; j++) {
        const seatId = `${rowLetter}${j}`;
        const isDisabled = config.disabledSeats.some(
          disabled => disabled.row === i && disabled.seat === j
        );
        const isPremium = config.premiumRows.includes(i + 1);
        const isAisle = config.aisleAfterSeat.includes(j);
        
        row.push({
          id: seatId,
          row: i,
          seat: j,
          rowLetter,
          seatNumber: j,
          type: isPremium ? 'premium' : 'regular',
          isDisabled,
          isAisle,
          isAvailable: !isDisabled
        });
      }
      layout.push(row);
    }
    
    setSeatLayout(layout);
  };

  const handleConfigChange = (field, value) => {
    setLayoutConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSeatToggle = (row, seat) => {
    const newDisabledSeats = layoutConfig.disabledSeats.slice();
    const existingIndex = newDisabledSeats.findIndex(
      disabled => disabled.row === row && disabled.seat === seat
    );
    
    if (existingIndex > -1) {
      newDisabledSeats.splice(existingIndex, 1);
    } else {
      newDisabledSeats.push({ row, seat });
    }
    
    setLayoutConfig(prev => ({
      ...prev,
      disabledSeats: newDisabledSeats
    }));
    
    generateSeatLayout({
      ...layoutConfig,
      disabledSeats: newDisabledSeats
    });
  };

  const saveSeatLayout = async () => {
    try {
      setLoading(true);
      // TODO: Implement API call to save seat layout
      console.log('Saving seat layout for screen:', selectedScreen, seatLayout);
      alert('Seat layout saved successfully!');
    } catch (err) {
      setError('Failed to save seat layout: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSeatClassName = (seat) => {
    let baseClass = 'w-8 h-8 text-xs font-medium rounded border-2 cursor-pointer transition-colors ';
    
    if (seat.isDisabled) {
      return baseClass + 'bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed';
    }
    
    if (seat.type === 'premium') {
      return baseClass + 'bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200';
    }
    
    return baseClass + 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200';
  };

  if (loading && seatLayout.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Seat Management</h2>
          <p className="text-gray-600 mt-1">Manage theater seating arrangements and layouts</p>
        </div>
        <button
          onClick={() => setShowLayoutEditor(!showLayoutEditor)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <PencilIcon className="h-5 w-5" />
          <span>{showLayoutEditor ? 'Hide Editor' : 'Layout Editor'}</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {/* Venue and Screen Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Select Venue and Screen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">Select Venue</option>
              {venues.map(venue => (
                <option key={venue.id} value={venue.id}>{venue.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Screen</label>
            <select
              value={selectedScreen}
              onChange={(e) => setSelectedScreen(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              disabled={!selectedVenue}
            >
              <option value="">Select Screen</option>
              {screens.map(screen => (
                <option key={screen.id} value={screen.id}>{screen.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Layout Configuration Panel */}
      {showLayoutEditor && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Layout Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
              <input
                type="number"
                value={layoutConfig.rows}
                onChange={(e) => handleConfigChange('rows', parseInt(e.target.value) || 1)}
                min="1"
                max="20"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats per Row</label>
              <input
                type="number"
                value={layoutConfig.seatsPerRow}
                onChange={(e) => handleConfigChange('seatsPerRow', parseInt(e.target.value) || 1)}
                min="1"
                max="30"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Rows</label>
              <input
                type="text"
                value={layoutConfig.premiumRows.join(', ')}
                onChange={(e) => handleConfigChange('premiumRows', 
                  e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                )}
                placeholder="1, 2, 3"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => generateSeatLayout(layoutConfig)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Layout
            </button>
          </div>
        </div>
      )}

      {/* Seat Layout Display */}
      {selectedScreen && seatLayout.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Seat Layout</h3>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded"></div>
                <span className="text-sm">Regular</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-100 border-2 border-purple-400 rounded"></div>
                <span className="text-sm">Premium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 border-2 border-gray-400 rounded"></div>
                <span className="text-sm">Disabled</span>
              </div>
            </div>
          </div>

          {/* Screen */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-lg mb-2">
              SCREEN
            </div>
            <div className="h-1 bg-gray-300 rounded mx-auto" style={{ width: '60%' }}></div>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col items-center space-y-2 overflow-x-auto">
            {seatLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center space-x-1">
                <div className="w-8 text-center font-medium text-gray-600">
                  {row[0]?.rowLetter}
                </div>
                {row.map((seat, seatIndex) => (
                  <React.Fragment key={seat.id}>
                    <button
                      onClick={() => handleSeatToggle(seat.row, seat.seat)}
                      className={getSeatClassName(seat)}
                      title={`${seat.id} - ${seat.type} ${seat.isDisabled ? '(Disabled)' : ''}`}
                    >
                      {seat.seatNumber}
                    </button>
                    {seat.isAisle && <div className="w-4"></div>}
                  </React.Fragment>
                ))}
                <div className="w-8 text-center font-medium text-gray-600">
                  {row[0]?.rowLetter}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-8">
            <button
              onClick={saveSeatLayout}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg"
            >
              {loading ? 'Saving...' : 'Save Layout'}
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      {selectedScreen && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click on seats to toggle disabled/enabled status</li>
            <li>• Use the Layout Editor to configure rows, seats per row, and premium sections</li>
            <li>• Premium rows are typically front rows with better pricing</li>
            <li>• Aisles provide walking space between seat sections</li>
            <li>• Remember to save your changes after editing</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminSeatManagement;