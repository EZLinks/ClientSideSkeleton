import { TypeConsts } from 'constants/typeConsts';

/**
 * validation helper.
 */
export class ValidationHelper {
    
    /**
     * checks if value is not empty guid
     */
    public static valueIsNotEmptyGuid(value: string): boolean {
        let isValueDefined = !!value;
        let isValueNotEmptyGuid = value !== TypeConsts.emptyGuid;

        return isValueDefined && isValueNotEmptyGuid;
    }
}