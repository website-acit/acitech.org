function doGet() {
  // Replace with your Google Sheet URL
  var sheetUrl = 'https://docs.google.com/spreadsheets/d/1_mt1C3_UwTmEpZfnH44PWt3xDqIc-GGUTSCe9Ku68Zo/edit?gid=0';

  try {
    var ss = SpreadsheetApp.openByUrl(sheetUrl);
    var sheet = ss.getActiveSheet();
    var data = sheet.getDataRange().getValues();

    var html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACIT Quick Links</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <style>
        .material-symbols-outlined {
            font-variation-settings:
            'FILL' 0,
            'wght' 400,
            'GRAD' 0,
            'opsz' 20
        }

        body {
            font-family: sans-serif;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
        }

        .container {
            max-width: 960px;
            margin: 20px auto;
            padding: 0 20px;
        }

        h1 {
            text-align: left;
            margin-bottom: 20px;
            color: #333;
        }

        #search-container {
            display: flex;
            align-items: center;
            height: 100%;
        }

        #search-input {
            padding: 10px;
            width: 300px;
            border: 1px solid #ccc;
            border-radius: 5px;
            margin: 0;
        }

        .software-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
            gap: 10px;
        }

        .software-item {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        .software-item:hover {
            transform: translateY(-5px);
        }

        .software-icon {
            font-size: 3em;
            margin-bottom: 5px;
            color: #555;
            line-height: 1;
        }

        .software-name {
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            line-height: 1.2;
        }

        .software-help-container {
            display: flex;
            gap: 8px;
        }

        .software-help-link {
            text-decoration: none;
            color: #888;
            display: inline-block;
            line-height: 1;
            margin-top: 5px;
            transition: color 0.2s ease-in-out;
        }

        .software-help-link .material-symbols-outlined {
            font-size: 1.5em;
            vertical-align: middle;
        }

        .software-help-link:hover {
            color: #79282a;
        }

        .software-description {
            display: none;
        }

        #help-link {
            color: white;
            text-decoration: none;
            display: flex;
            align-items: center;
        }

        #help-link span {
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="software-grid" id="software-grid">
  `;

    for (var i = 1; i < data.length; i++) {
      var name = data[i][0];
      var link = data[i][1];
      var iconUrl = data[i][2];
      var knowledgeBaseLink = data[i][3];
      var helpLink = data[i][4];

      if (name && link && iconUrl) {
        html += `
            <div class="software-item" data-name="${name}">
                <a href="${link}" target="_blank" style="text-decoration: none; color: inherit;">
                    <div class="software-icon">
                        <img width="40" height="40" src="${iconUrl}" alt="${name}"/>
                    </div>
                    <div class="software-name">${name}</div>
                </a>
                <div class="software-help-container">
                    <a href="${knowledgeBaseLink}" class="software-help-link" target="_blank" rel="noopener noreferrer" title="Knowledge Base">
                        <span class="material-symbols-outlined">description</span>
                    </a>
                    <a href="${helpLink}" class="software-help-link" target="_blank" rel="noopener noreferrer" title="Get Help">
                        <span class="material-symbols-outlined">support_agent</span>
                    </a>
                </div>
                <div class="software-description">${name}</div>
            </div>
      `;
      }
    }

    html += `
        </div>
    </div>
</body>
</html>
  `;

    return HtmlService.createHtmlOutput(html);
  } catch (e) {
    // Handle errors (e.g., sheet not found, data issues)
    Logger.log('Error: ' + e.toString());
    return HtmlService.createHtmlOutput('<h1>Error loading data. Check the script logs.</h1><p>'+e.toString()+'</p>');
  }
}
