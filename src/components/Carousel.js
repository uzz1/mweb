export const Carousel = ({ items, onSelect, selectedItems, providerInfo }) => {
    return (
      <div>
        {items.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelect(item)}
            style={{
              display: "inline-block",
              border: selectedItems.includes(item) ? "4px solid blue" : "",
              margin: "10px",
              padding: "10px",
            }}
          >
             <img src={providerInfo.find(p => p.name === item)?.url} alt={item} />
          </div>
        ))}
      </div>
    );
  };