import gifWall from './gifWall.mjs';

export default( async () => {
    try {
        await new gifWall().Start(80);
    } catch(error) {
        throw error;
    }
})();
