import React from 'react'
import { compareConditionValue } from './../utils/helper'
import Text from './type/Text'
import Textarea from './type/Textarea'
import Checkbox from './type/Checkbox'
import Radio from './type/Radio'
import Email from './type/Email'
import Error from './type/Error'
import Select from './type/Select'
import ManageScheduleToggle from './type/ManageScheduleToggle'
import ManageDelayedSchedule from './type/ManageDelayedSchedule'
import CreatableSelect from './type/CreatableSelect'
import Collapsible from './type/Collapsible'
import SocialProfile from './type/SocialProfile'
import Group from './type/Group'
import ScheduleTable from './type/ScheduleTable'
import RawHTML from './type/RawHTML'
import Time from './type/Time'
import MissSchedule from './type/MissSchedule'
import License from './type/License'
import Number from './type/Number'
import Screenshot from './type/Screenshot'

const Fields = (props) => {
    const isFalseConditionalStatus = compareConditionValue(
        props.condition,
        props.values
    )
    let renderComponent
    switch (props.type) {
        case 'text':
            renderComponent = <Text {...props} />
            break
        case 'number':
            renderComponent = <Number {...props} />
            break
        case 'email':
            renderComponent = <Email {...props} />
            break
        case 'textarea':
            renderComponent = <Textarea {...props} />
            break
        case 'checkbox':
            renderComponent = <Checkbox {...props} />
            break
        case 'radio':
            renderComponent = <Radio {...props} />
            break
        case 'group':
            renderComponent = <Group {...props} />
            break
        case 'select':
            renderComponent = <Select {...props} />
            break
        case 'creatableselect':
            renderComponent = <CreatableSelect {...props} />
            break
        case 'collapsible':
            renderComponent = <Collapsible {...props} />
            break
        case 'socialprofile':
            renderComponent = <SocialProfile {...props} />
            break
        case 'scheduletable':
            renderComponent = <ScheduleTable {...props} />
            break
        case 'manageDelayedSchedule':
            renderComponent = <ManageDelayedSchedule {...props} />
            break
        case 'manageScheduleToggle':
            renderComponent = <ManageScheduleToggle {...props} />
            break
        case 'license':
            renderComponent = <License {...props} />
            break
        case 'rawhtml':
            renderComponent = <RawHTML {...props} />
            break
        case 'time':
            renderComponent = <Time {...props} />
            break
        case 'MissSchedule':
            renderComponent = <MissSchedule {...props} />
            break
        case 'screenshot':
            renderComponent = <Screenshot {...props} />
            break
        default:
            renderComponent = <Error {...props} />
            break
    }

    if (props.condition !== undefined && isFalseConditionalStatus) {
        return ''
    } else {
        return (
            <div
                className={
                    isFalseConditionalStatus !== true
                        ? 'conditional-fields ' + props.id
                        : 'standard-fields ' + props.id
                }
            >
                {renderComponent}
            </div>
        )
    }
}

export default Fields
