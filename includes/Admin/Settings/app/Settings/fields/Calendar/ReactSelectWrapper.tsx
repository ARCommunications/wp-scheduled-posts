import React, { useEffect, useMemo, useState } from "react";
import ReactSelect, { ActionMeta, components } from "react-select";
import { selectStyles } from "../../helper/styles";

export type Option = {
  value: string;
  label: string;
  options?: Option[];
};

type Props = {
  options: Option[];
  value: Option[];
  onChange?: (selectedOption: Option[] | null) => void;
  showTags?: boolean;
  placeholder?: string;
};

export const getOptionsFlatten = (options: Option[]) => {
  const optionsArray = [];
  options.forEach(category => {
    if (category.options) {
      optionsArray.push(...category.options);
    } else {
      optionsArray.push(category);
    }
  });
  return optionsArray;
};

export const addAllOption = (options: Option[]) => {
  return [
    { label: "All", value: "all" },
    ...Object.values(options || []),
  ];
}

const ReactSelectWrapper: React.FC<Props> = ({ options, value, onChange, showTags = false, ...rest }) => {
  const allOption = useMemo(() => addAllOption(options), [options]);
  const allOptionFlatten = useMemo(() => getOptionsFlatten(allOption), [allOption]);
  // const [selectedPostType, setSelectedPostType] =
  //   useState<MultiValue<Option>>(allOptionFlatten);

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  // Add and remove
  const handleChange = (
    newValue: Option[],
    actionMeta: ActionMeta<any>
  ) => {
    if (actionMeta.action === "select-option") {
      if (actionMeta.option.value === "all") {
        newValue = allOptionFlatten;
      } else {
        newValue = newValue.filter((item) => item.value !== "all");
        if (newValue.length === Object.values(getOptionsFlatten(options)).length) {
          newValue = allOptionFlatten;
        }
      }
    } else if (actionMeta.action === "deselect-option") {
      if (actionMeta.option.value === "all") {
        newValue = [];
      } else {
        newValue = newValue.filter((item) => item.value !== "all");
        // if (newValue.length === 0) {
        //   newValue = allOptionFlatten;
        // }
      }
    }
    onChange(newValue);
  };
  const removeItem = (item) => {
    const updatedItems = value.filter((i) => i !== item);
    handleChange(updatedItems, {
      action: "deselect-option",
      option: item,
    });
  };

  useEffect(() => {
    // onChange(selectedPostType);
  }, [])

  useEffect(() => {
    // setSelectedPostType(allOptionFlatten);
    // console.log(options);

  }, [options])

  return (
    <>
    <ReactSelect
      {...rest}
      options={allOption}
      value={value}
      onChange={handleChange}
      components={{
        Option,
      }}
      styles={selectStyles}
      closeMenuOnSelect={false}
      hideSelectedOptions={false}
      autoFocus={false}
      controlShouldRenderValue={false}
      className="main-select"
      isMulti
    />
    {showTags && (
      <div className="selected-options">
        <ul>
          {value?.filter(item => (allOptionFlatten.length === value.length) ? (item.value === 'all') : true ).map((item, index) => (
            <li key={index}>
              {" "}
              {item?.label}{" "}
              <button onClick={() => removeItem(item)}>
                {" "}
                <i className="wpsp-icon wpsp-close"></i>{" "}
              </button>{" "}
            </li>
          ))}
        </ul>
      </div>
    )}
    </>
  );
};

export default ReactSelectWrapper;