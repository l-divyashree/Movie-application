import React, { useState, useEffect } from 'react';
import accessibleIcon from '../../assets/icons/accessible.svg';
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
  const [premiumMode, setPremiumMode] = useState(false);

  const [layoutConfig, setLayoutConfig] = useState({
    rows: '10',
    seatsPerRow: '15',
    aisleAfterSeat: [5, 10], // Aisle positions
    premiumRows: [], // Premium/VIP rows (legacy: whole-row premium)
    disabledSeats: [], // Array of {row, seat} objects
    accessibleRows: [], // rows reserved for physically disabled (1-based indices)
    premiumSeats: [] // per-seat premium (array of {row, seat})
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
      // Try to load saved admin layout from localStorage keyed by venueId + screenName
      const adminLayouts = JSON.parse(localStorage.getItem('adminSeatLayouts') || '{}');
      const key = selectedVenue && selectedScreen ? `${selectedVenue}:${selectedScreen}` : null;
      if (key && adminLayouts[key]) {
        setSeatLayout(adminLayouts[key]);
        return;
      }

      // Fallback: generate mock seat layout - replace with actual API call
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
    const accessibleSet = new Set((config.accessibleRows || []).map(n => parseInt(n, 10)));
    const rowsCount = parseInt(config.rows, 10) || 10;
    const seatsPerRowCount = parseInt(config.seatsPerRow, 10) || 15;
    for (let i = 0; i < rowsCount; i++) {
      const row = [];
      const rowLetter = rows[i];
      
      for (let j = 1; j <= seatsPerRowCount; j++) {
        const seatId = `${rowLetter}${j}`;
        const isDisabled = config.disabledSeats.some(
          disabled => disabled.row === i && disabled.seat === j
        );
        const isPremium = config.premiumRows.includes(i + 1);
        const isAisle = config.aisleAfterSeat.includes(j);
        const isAccessible = accessibleSet.has(i + 1);
        
        row.push({
          id: seatId,
          row: i,
          seat: j,
          rowLetter,
          seatNumber: j,
          type: isPremium ? 'premium' : 'regular',
          isDisabled,
          isAisle,
          isAccessible,
          isAvailable: !isDisabled
        });
      }
      layout.push(row);
    }
    
    setSeatLayout(layout);
    return layout;
  };

  // Toggle seat state in the current seatLayout: premium or disabled
  const handleSeatToggle = (rowIndex, seatNumber) => {
    const newLayout = seatLayout.map((row, rIdx) => {
      if (rIdx !== rowIndex) return row.map(s => ({ ...s }));
      return row.map(s => {
        if (s.seat !== seatNumber) return { ...s };
        const copy = { ...s };
        if (premiumMode) {
          copy.type = copy.type === 'premium' ? 'regular' : 'premium';
        } else {
          copy.isDisabled = !copy.isDisabled;
          copy.isAvailable = !copy.isDisabled;
        }
        return copy;
      });
    });

    setSeatLayout(newLayout);

    // Rebuild disabledSeats in layoutConfig from newLayout
    const newDisabled = [];
    newLayout.forEach((row, rIdx) => {
      row.forEach(seat => {
        if (seat.isDisabled) newDisabled.push({ row: rIdx, seat: seat.seat });
      });
    });
    setLayoutConfig(prev => ({ ...prev, disabledSeats: newDisabled }));
  };

  const handleConfigChange = (field, value) => {
    setLayoutConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveSeatLayout = async () => {
    try {
      setLoading(true);
      // Persist layout to localStorage so SeatSelection can read it
      if (!selectedVenue || !selectedScreen) {
        alert('Please select a venue and screen before saving layout');
        return;
      }

      const adminLayouts = JSON.parse(localStorage.getItem('adminSeatLayouts') || '{}');
      const key = `${selectedVenue}:${selectedScreen}`;
      adminLayouts[key] = seatLayout;
      localStorage.setItem('adminSeatLayouts', JSON.stringify(adminLayouts));
      console.log('Saved admin seat layout under', key);
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
      return baseClass + 'bg-gray-900 text-white border-gray-800 hover:bg-gray-800';
    }
    
    if (seat.isAccessible) {
      return baseClass + 'bg-gray-900 text-white border-red-600';
    }

    return baseClass + 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200';
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

      {/* If no layout and editor not opened, show CTA to start editor */}
      {seatLayout.length === 0 && !showLayoutEditor ? (
        <div className="bg-white p-12 rounded-lg shadow-sm border text-center">
          <h3 className="text-xl font-semibold mb-4">No seat layout found</h3>
          <p className="text-gray-600 mb-6">Start the Layout Editor to configure rows, seats per row, premium rows and accessible rows, then generate and save the layout.</p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowLayoutEditor(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg"
            >
              Start Layout Editor
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Select Venue and Screen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
              <select
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 appearance-none relative z-50"
              >
                <option value="" style={{ color: '#374151' }}>Select Venue</option>
                {venues.length === 0 ? (
                  <option value="" disabled style={{ color: '#6b7280' }}>No venues available</option>
                ) : (
                  venues.map(venue => (
                    <option key={venue.id} value={venue.id} style={{ color: '#111827' }}>{venue.name}</option>
                  ))
                )}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Screen</label>
              <select
                value={selectedScreen}
                onChange={(e) => setSelectedScreen(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400 appearance-none relative z-50"
                disabled={!selectedVenue}
              >
                <option value="" style={{ color: '#374151' }}>Select Screen</option>
                {screens.length === 0 ? (
                  <option value="" disabled style={{ color: '#6b7280' }}>No screens available</option>
                ) : (
                  screens.map(screen => (
                    <option key={screen.id} value={screen.id} style={{ color: '#111827' }}>{screen.name}</option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Layout Configuration Panel */}
      {showLayoutEditor && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Layout Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rows</label>
              <input
                type="number"
                value={layoutConfig.rows}
                onChange={(e) => handleConfigChange('rows', e.target.value)}
                min="1"
                max="20"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats per Row</label>
              <input
                type="number"
                value={layoutConfig.seatsPerRow}
                onChange={(e) => handleConfigChange('seatsPerRow', e.target.value)}
                min="1"
                max="30"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accessible Rows (for disabled)</label>
              <input
                type="text"
                value={(layoutConfig.accessibleRows || []).join(', ')}
                onChange={(e) => handleConfigChange('accessibleRows', 
                  e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                )}
                placeholder="1, 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                // Generate layout and immediately persist if venue+screen selected
                const layout = generateSeatLayout(layoutConfig);
                if (selectedVenue && selectedScreen) {
                  const adminLayouts = JSON.parse(localStorage.getItem('adminSeatLayouts') || '{}');
                  const key = `${selectedVenue}:${selectedScreen}`;
                  adminLayouts[key] = layout;
                  localStorage.setItem('adminSeatLayouts', JSON.stringify(adminLayouts));
                  console.log('Generate & saved layout for', key);
                }
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Generate Layout
            </button>
          </div>
        </div>
      )}

      {/* Seat Layout Display */}
      {seatLayout.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Seat Layout</h3>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={premiumMode} onChange={() => setPremiumMode(p => !p)} className="form-checkbox" />
                <span className="text-sm">Premium Mode (toggle to mark seats)</span>
              </label>
              <div className="flex space-x-4 ml-4">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm">Regular</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-900 border-2 border-gray-800 rounded"></div>
                  <span className="text-sm">Premium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-900 border-2 border-green-600 rounded flex items-center justify-center text-white text-[10px]">♿</div>
                  <span className="text-sm">Accessible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Screen */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gray-800 text-white px-8 py-2 rounded-lg mb-2">SCREEN</div>
            <div className="h-1 bg-gray-300 rounded mx-auto" style={{ width: '60%' }}></div>
          </div>

          {/* Seat Grid */}
          <div className="flex flex-col items-center space-y-2 overflow-x-auto">
            {seatLayout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center space-x-1">
                <div className="w-8 text-center font-medium text-gray-600">{row[0]?.rowLetter}</div>
                {row.map((seat) => (
                  <React.Fragment key={seat.id}>
                    <button
                      onClick={() => handleSeatToggle(seat.row, seat.seat)}
                      className={getSeatClassName(seat)}
                      title={`${seat.id} - ${seat.type} ${seat.isDisabled ? '(Disabled)' : ''}`}
                    >
                      <div className="flex items-center justify-center">
                        {seat.isAccessible ? (
                          <img src={accessibleIcon} alt="accessible" className="h-4 w-4 object-contain" />
                        ) : (
                          <span className="text-xs">{seat.seatNumber}</span>
                        )}
                      </div>
                    </button>
                    {seat.isAisle && <div className="w-4"></div>}
                  </React.Fragment>
                ))}
                <div className="w-8 text-center font-medium text-gray-600">{row[0]?.rowLetter}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-center mt-8">
            <button onClick={saveSeatLayout} disabled={loading} className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg">
              {loading ? 'Saving...' : 'Save Layout'}
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Click on seats to toggle disabled/enabled status</li>
              <li>• Toggle Premium Mode to mark/unmark specific seats as premium</li>
              <li>• Use the Layout Editor to configure rows, seats per row, and accessible rows</li>
              <li>• Aisles provide walking space between seat sections</li>
              <li>• Remember to save your changes after editing</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeatManagement;