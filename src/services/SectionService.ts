const sectionService = {
    getSections: (points, activePoint) => {
        return points.reduce((acc, item) => {
            if (item.properties.isASC === 0) {
                return acc;
            }

            const sectionId = String(item.properties.isASC);
            const pointId = item.properties.ulid;
            const coords = item.properties.latLng;

            if (!acc[sectionId])
            {
                acc[sectionId] = { [pointId]: { coords } };
            }
            else
            {
                acc[sectionId][pointId] = { coords };
            }

            return acc;
        }, {});
    }
}

export default sectionService;