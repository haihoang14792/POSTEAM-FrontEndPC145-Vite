import ReactGA from 'react-ga4';

export const initGA = () => {
    ReactGA.initialize('G-GN52V2SDRT'); // 🔁 Thay bằng Measurement ID GA4 của bạn
};

export const logPageView = (path) => {
    ReactGA.send({ hitType: 'pageview', page: path });
};
