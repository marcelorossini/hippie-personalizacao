// Lista de fontes do Google Fonts
export const fontOptions = [
  { value: 'Roboto', label: 'Roboto', preview: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat', preview: 'Montserrat' },
  { value: 'Open Sans', label: 'Open Sans', preview: 'Open Sans' },
  { value: 'Lato', label: 'Lato', preview: 'Lato' },
  { value: 'Poppins', label: 'Poppins', preview: 'Poppins' },
  { value: 'Raleway', label: 'Raleway', preview: 'Raleway' },
  { value: 'Oswald', label: 'Oswald', preview: 'Oswald' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', preview: 'Source Sans Pro' },
  { value: 'Ubuntu', label: 'Ubuntu', preview: 'Ubuntu' },
  { value: 'Playfair Display', label: 'Playfair Display', preview: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather', preview: 'Merriweather' },
  { value: 'PT Sans', label: 'PT Sans', preview: 'PT Sans' },
  { value: 'Nunito', label: 'Nunito', preview: 'Nunito' },
  { value: 'Quicksand', label: 'Quicksand', preview: 'Quicksand' },
  { value: 'Dancing Script', label: 'Dancing Script', preview: 'Dancing Script' },
  { value: 'Pacifico', label: 'Pacifico', preview: 'Pacifico' },
  { value: 'Comfortaa', label: 'Comfortaa', preview: 'Comfortaa' },
  { value: 'Josefin Sans', label: 'Josefin Sans', preview: 'Josefin Sans' },
  { value: 'Bebas Neue', label: 'Bebas Neue', preview: 'Bebas Neue' },
  { value: 'Righteous', label: 'Righteous', preview: 'Righteous' },
];

// Função para carregar as fontes do Google Fonts
export const loadGoogleFonts = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontOptions.map(f => f.value.replace(' ', '+')).join('&family=')}&display=swap`;
  document.head.appendChild(link);
}; 