var Game1 = React.createClass({
    render: function() {
      return (
        <div>
          <link rel="stylesheet" href="../css/style.css" />
          <title>Cookie Clicker</title>
          <div>
            <h1 id="main-heading3">Click the Cat!</h1>
          </div>
          <div className="border">
          </div>
          <div className="cookes-display">
            <h2 id="cookie-count"> Cookies: <span id="num_of_cookies"> 0 </span> </h2>
            <button id="cookie-button" className="cookie-button" onclick="makeCookie()">
            </button> 
          </div>
        </div>
      );
    }
  });