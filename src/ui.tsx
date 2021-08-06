import React, {
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactElement,
} from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";
import * as EOSIcons from "eos-icons-react";
import FormHolder from "./FormHolder";
import EOSIconsList from "./converted-icons.json";
import OptionsList from "./optionList.json";
import IconBox from "./IconBox";
import "./ui.css";

const App = () => {
  const searchCategory = useRef<HTMLSelectElement>();
  const searchTheme = useRef<HTMLSelectElement>();
  const inputField = useRef<HTMLInputElement>();
  const [helperText, setHelperText] = useState(
    "Let's start by searching abstract."
  );
  const [iconsContainer, updateIcons] = useState<ReactElement[]>(null);
  const [alert, updateAlert] = useState<boolean>(false);
  const pushToNode = useCallback((svg: any) => {
    parent.postMessage(
      {
        pluginMessage: {
          type: "handle-icon",
          svg: ReactDOMServer.renderToStaticMarkup(svg),
        },
      },
      "*"
    );
    updateAlert(true);
    setTimeout(() => {
      updateAlert(false);
    }, 1000);
  }, []);

  const searchIconsByName = useCallback((name, theme, option) => {
    const icons = [];
    EOSIconsList[option].forEach((icon) => {
      const isFilledAvailable = "hasOutlined" in icon && icon.hasOutlined;
      const isFilledSelected = theme === "Filled";
      if (
        icon.name.indexOf(name) !== -1 &&
        (!isFilledSelected || (isFilledSelected && isFilledAvailable))
      ) {
        const nameIcon = `Eos_${icon.name}_${theme}`.toUpperCase();
        const EOSReactIcon = EOSIcons[nameIcon];
        if (EOSReactIcon !== undefined) {
          icons.push({ EOSReactIcon, name: nameIcon });
        }
      }
    });
    if (icons.length === 0) {
      return null;
    }
    return (
      <IconBox
        option={option}
        key={option}
        icons={icons}
        pushToNode={pushToNode}
      />
    );
  }, []);
  const createIcons = useCallback((option) => {
    const icons = [];
    const limit =
      EOSIconsList[option].length < 10 ? EOSIconsList[option].length : 10;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < limit; i++) {
      const icon = EOSIconsList[option][i];
      const name = EOSIcons[`Eos_${icon.name}_Filled`.toUpperCase()]
        ? `Eos_${icon.name}_Filled`.toUpperCase()
        : `Eos_${icon.name}_Outlined`.toUpperCase();
      const EOSReactIcon = EOSIcons[name];
      if (EOSReactIcon !== undefined) {
        icons.push({ EOSReactIcon, name });
      }
    }

    return (
      <IconBox
        option={option}
        icons={icons}
        key={option}
        pushToNode={pushToNode}
      />
    );
  }, []);

  useEffect(() => {
    updateIcons(OptionsList.map((option) => createIcons(option)));
  }, []);

  const clearValue = useCallback(() => {
    inputField.current.value = "";
    setHelperText("Let's start by searching abstract.");
    updateIcons(OptionsList.map((option) => createIcons(option)));
  }, []);
  const onSearch = useCallback(() => {
    const category = searchCategory.current.value;
    const theme = searchTheme.current.value;
    const name = inputField.current.value;
    let iconList;
    if (category === "all") {
      iconList = OptionsList.map((option) =>
        searchIconsByName(name, theme, option)
      );
    } else {
      iconList = searchIconsByName(name, theme, category);
    }
    updateIcons(iconList);
  }, []);

  const handleKeyUp = useCallback((event) => {
    setHelperText(`We would be searching for ${inputField.current.value}`);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      onSearch();
    }
  }, []);

  return (
    <React.Fragment>
      {alert ? (
        <div className="alert">
          <span>Svg has been copied!!</span>
        </div>
      ) : null}
      <FormHolder
        helperText={helperText}
        inputField={inputField}
        handleKeyUp={handleKeyUp}
        onSearch={onSearch}
        searchTheme={searchTheme}
        searchCategory={searchCategory}
        iconOptions={iconsContainer}
        clearValue={clearValue}
      />
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("eos"));
