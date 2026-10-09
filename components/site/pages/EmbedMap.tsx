const EmbedMap = () => {
  return (
    <div className="embed-map-fixed">
      <div className="embed-map-container">
        <iframe
          className="embed-map-frame"
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=sanjaya%20lighting&t=&z=14&ie=UTF8&iwloc=B&output=embed"
          title="Sanjaya Lighting Location"
          loading="lazy"
        ></iframe>
      </div>
      <style jsx>{`
        .embed-map-fixed {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 280px;
        }
        .embed-map-container {
          overflow: hidden;
          background: #f6f6f6;
          width: 100%;
          height: 100%;
          min-height: 280px;
        }
        .embed-map-frame {
          width: 100% !important;
          height: 100% !important;
          min-height: 280px;
          border: 0;
          filter: grayscale(1);
        }
      `}</style>
    </div>
  );
};

export default EmbedMap
