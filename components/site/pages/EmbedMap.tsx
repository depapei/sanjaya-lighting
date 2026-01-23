const EmbedMap = () => {
  return (
    <div className="embed-map-fixed">
      <div className="embed-map-container">
        <iframe
          className="embed-map-frame"
          src="https://maps.google.com/maps?width=600&height=400&hl=en&q=sanjaya%20lighting&t=&z=14&ie=UTF8&iwloc=B&output=embed"
          title="Sanjaya Lighting Location"
        ></iframe>
        <a
          href="https://classicjoy.games"
          style={{
            fontSize: '2px',
            color: 'gray',
            position: 'absolute',
            bottom: 0,
            left: 0,
            zIndex: 1,
            maxHeight: '1px',
            overflow: 'hidden',
          }}
        >
          Retro Games Online
        </a>
      </div>
      <style jsx>{`
        .embed-map-fixed {
          position: relative;
          text-align: right;
          width: 450px;
          height: 250px;
        }
        .embed-map-container {
          overflow: hidden;
          background: none !important;
          width: 450px;
          height: 250px;
        }
        .embed-map-frame {
          width: 450px !important;
          height: 250px !important;
        }
      `}</style>
    </div>
  );
};

export default EmbedMap