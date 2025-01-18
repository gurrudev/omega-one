class AppController {
    static getListening = (req, res) => {
        try {
            return res.status(200).json({ message: 'API is working...' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
}

export default AppController;
