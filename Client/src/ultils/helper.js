import icons from "./icons";
const { ImStarEmpty, ImStarFull, ImStarHalf } = icons;

export const createSlug = (string) =>
  string
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(" ")
    .join("-");

    export const formatMoney = (number) => {
      if (number == null) return "0"; 
      return Number(number.toFixed(1)).toLocaleString();
    };
    


export const renderStar = (number, size) => {
  if (!Number.isFinite(Number(number))) return null;

  const rating = Math.min(Math.max(Number(number), 0), 5);

  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<ImStarFull key={`full-${i}`} size={size || 16} />);
  }

  if (hasHalfStar) {
    stars.push(<ImStarHalf key={`half-${fullStars}`} size={size || 16}/>);
  }

  for (let i = fullStars + (hasHalfStar ? 1 : 0); i < 5; i++) {
    stars.push(<ImStarEmpty key={`empty-${i}`} size={size || 16}/>);
  }

  return stars;
};

/**
 * Converts a duration in milliseconds to an object with hours, minutes, and seconds.
 * 
 * @param {number} d - Duration in milliseconds.
 * @returns {object} An object containing hours, minutes, and seconds.
 */
export function secondsToHms(d) {
  // Convert milliseconds to seconds
  d = Math.max(Number(d) / 1000, 0);
  
  // Calculate hours, minutes, and seconds
  const h = Math.floor(d / 3600);
  const m = Math.floor((d % 3600) / 60);
  const s = Math.floor(d % 60);
  
  return { h, m, s };
}

export const validate = (payload, setInvalidFields) => {
  let invalids = 0;
  let errors = [];

  // Clear previous errors
  setInvalidFields([]);

  // Check for required fields
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string' && value.trim() === '') {
      invalids++;
      errors.push({ name: key, mes: 'This field is required' });
    } else if (typeof value !== 'string' && !value) {
      invalids++;
      errors.push({ name: key, mes: 'This field is required' });
    }
  }

  // Additional validation rules can be added here
  // Example: Check for email format
  if (payload.email && !/\S+@\S+\.\S+/.test(payload.email)) {
    invalids++;
    errors.push({ name: 'email', mes: 'Invalid email format' });
  }

  // Example: Check for password length
  if (payload.password && payload.password.length < 6) {
    invalids++;
    errors.push({ name: 'password', mes: 'Password must be at least 6 characters' });
  }

  if (payload.mobile && !/^\d+$/.test(payload.mobile)) {
    invalids++;
    errors.push({ name: 'mobile', mes: 'Mobile number must be numeric' });
  }

  setInvalidFields(errors);

  return invalids;
};


export const generateRange = (start, end) => {
  const length = end+1-start
  return Array.from({length}, (_, index) => start+index)
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
  });
}

export const formatCurrencyShort = (value) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(1) + "T";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + "M";
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + "K";
  } else {
    return value.toLocaleString();
  }
};