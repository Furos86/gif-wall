export default class GifEntitiesService {
    database

    constructor(databaseService) {
        this.database = databaseService;
    }

    Create() {
        //creates a gif entity
        //after create, emit update event
    }

    Remove() {
        //remove gif entity
        //after remove. emit remove entity event
    }

    Update() {
        /*
            location
            layer
            after update, emit new location/layer state
         */
    }

    EntitiesInArea() {
        //retrieves all entities within area on all layers
    }
}
