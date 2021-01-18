import gifWall from './gifwall';

export default( async () => {
    try {
        await new gifWall().Start(80);
    } catch(error) {
        throw error;
    }
})();
