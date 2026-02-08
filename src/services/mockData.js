export const MOCK_CINEMAS = [
    {
        id: '1',
        name: 'PVR: Hitech City',
        location: 'Hyderabad',
        facilities: ['Dolby Atmos', '4K', 'Recliner'],
        rating: 4.5
    },
    {
        id: '2',
        name: 'AMB Cinemas: Gachibowli',
        location: 'Hyderabad',
        facilities: ['Laser Projection', 'Dolby Atmos', 'V-IP'],
        rating: 4.8
    },
    {
        id: '3',
        name: 'Prasads Multiplex',
        location: 'Hyderabad',
        facilities: ['Large Screen', 'DTS', 'Food Court'],
        rating: 4.2
    },
    {
        id: '4',
        name: 'INOX: GVK One',
        location: 'Hyderabad',
        facilities: ['Insignia', 'Butler Service', 'Recliner'],
        rating: 4.6
    },
    {
        id: '5',
        name: 'Asian CineSquare: Uppal',
        location: 'Hyderabad',
        facilities: ['2K', 'Dolby 7.1'],
        rating: 4.0
    }
];

export const getNext7Days = () => {
    const days = [];
    const today = new Date();
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        let displayDay;
        if (i === 0) displayDay = "TODAY";
        else if (i === 1) displayDay = "TOM";
        else displayDay = dayNames[date.getDay()];

        days.push({
            dateObj: date,
            day: displayDay,
            date: date.getDate().toString().padStart(2, '0'),
            month: monthNames[date.getMonth()],
            fullDate: date.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }
    return days;
};

export const MOVIE_SHOWTIMES = [
    '09:30 AM', '10:15 AM', '12:45 PM', '01:30 PM', '03:30 PM', '04:15 PM',
    '06:45 PM', '07:30 PM', '10:00 PM', '10:45 PM', '11:15 PM'
];

// Helper to randomize showtimes for a cinema/movie combo so it looks dynamic
export const getShowtimesForCinema = (cinemaId, movieId) => {
    // Deterministic random based on IDs to keep it consistent for same view
    const seed = cinemaId.charCodeAt(0) + (typeof movieId === 'string' ? movieId.charCodeAt(0) : movieId);
    const count = 4 + (seed % 5); // 4 to 8 shows

    // Shuffle and slice
    const shuffled = [...MOVIE_SHOWTIMES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).sort((a, b) => {
        // Simple sort by AM/PM logic
        const getMins = (t) => {
            const [time, period] = t.split(' ');
            let [h, m] = time.split(':').map(Number);
            if (period === 'PM' && h !== 12) h += 12;
            if (period === 'AM' && h === 12) h = 0;
            return h * 60 + m;
        };
        return getMins(a) - getMins(b);
    });
};
