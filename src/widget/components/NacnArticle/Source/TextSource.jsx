import styles from "../NacnArticle.module.scss";
import IconPlus from "../../../icons/IconPlus";
import IconTrash from "../../../icons/IconTrash";

const TextSource = ({
  textSources,
  setTextSources,
  currentIndex,
  setCurrentIndex,
}) => {
  return (
    <div>
      <ul className={styles.alt_tabs}>
        {textSources.map((i, index) => (
          <li
            className={`${styles.alt_tabs_item} ${
              currentIndex === index && styles.active
            }`}
            key={index}
            onClick={() => {
              setCurrentIndex(index);
            }}
          >
            Texte {index + 1}{" "}
            {index > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  let tab = [...textSources];
                  const removed = tab.splice(index, 1);
                  setTextSources(tab);
                  setCurrentIndex(0);
                }}
              >
                <IconTrash />
              </span>
            )}
          </li>
        ))}
        <li
          className={styles.tab_plus}
          onClick={() => {
            setTextSources([...textSources, ""]);
            setCurrentIndex(textSources.length);
          }}
        >
          <IconPlus />
        </li>
      </ul>

      <textarea
        className={`${styles.textContent} ${styles.textarea} ${styles.notop_radius}`}
        rows="10"
        value={textSources[currentIndex]}
        onChange={(e) => {
          const tab = [...textSources];
          tab[currentIndex] = e.target.value;
          setTextSources(tab);
        }}
      ></textarea>
    </div>
  );
};

export default TextSource;
