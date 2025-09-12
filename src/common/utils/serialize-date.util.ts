// Ruta: src/common/utils/serialize-date.util.ts

import { isObject, isArray } from 'lodash';
import { format } from 'date-fns';

export const serializeDates = (data: any): any => {
    if (data instanceof Date) {
        // Usamos la función format para dar un formato más legible (año, mes, dia, hora, minuto, segundo)
        return format(data, 'yyyy-MM-dd HH:mm:ss');
    }
    if (isArray(data)) {
        return data.map((item) => serializeDates(item));
    }
    if (isObject(data)) {
        const serializedData: any = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                serializedData[key] = serializeDates(data[key]);
            }
        }
        return serializedData;
    }
    return data;
};
