import csv

def generate_quicklinks_html(csv_file_path, output_html_path="ACT-Calendars.html"):
    """
    Generates an HTML page with quick links from a CSV file.

    Args:
        csv_file_path (str): The path to the CSV file.
        output_html_path (str): The path to save the generated HTML file.
    """

    try:
        with open(csv_file_path, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.reader(csvfile)
            header = next(reader)  # Skip the header row

            html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ACIT Calendars</title>
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

        header {
            background-color: #79282a;
            padding: 10px 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 60px; /* Explicitly set the header height */
            flex-wrap: wrap; /* Allow wrapping on small screens */
        }

        @media (max-width: 600px) { /* Adjust breakpoint as needed */
            header {
                height: auto; /* Allow header to expand */
                align-items: flex-start; /* Align items to top on wrap */
            }
            #search-container, .header-links {
                width: 100%; /* Take full width on small screens */
            }
            #search-container {
                margin-bottom: 10px;
            }
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

        .icon-color {
            color: #79282a
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
    <header>
        <div id="search-container">
            <input type="text" id="search-input" placeholder="Search Calendars...">
        </div>
        <div class="header-links">
            <div class="software-help-container">
                <a id="help-link" href="https://atlanticcountyinstituteofthelpdesk.freshservice.com/support/catalog/items/540" target="_blank" rel="noopener noreferrer">
                    <span class="material-symbols-outlined">support_agent</span> Get Help
                </a>
            </div>
        </div>
    </header>
    <div class="container">
        <div class="software-grid" id="software-grid">
"""

            for row in reader:
                name, link = row

                if name and link:
                    html += f"""
            <div class="software-item" data-name="{name}">
                <a href="{link}" target="_blank" style="text-decoration: none; color: inherit;">
                    <span class="software-icon icon-atlas icon-color material-symbols-outlined">calendar_month</span>
                    <div class="software-name">{name}</div>
                </a>
                <div class="software-description">{name}</div>
            </div>
            """

            html += """
        </div>
    </div>
    <script>
        const searchInput = document.getElementById('search-input');
        const softwareItems = document.querySelectorAll('.software-item');

        searchInput.addEventListener('input', function() {
            const searchTerm = searchInput.value.toLowerCase();

            softwareItems.forEach(item => {
                const softwareName = item.dataset.name.toLowerCase();
                if (softwareName.includes(searchTerm)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    </script>
</body>
</html>
"""

        with open(output_html_path, 'w', encoding='utf-8') as html_file:
            html_file.write(html)

        print(f"HTML file '{output_html_path}' created successfully.")

    except FileNotFoundError:
        print(f"Error: CSV file '{csv_file_path}' not found.")
    except Exception as e:
        print(f"An error occurred: {e}")

# Example usage (replace 'your_file.csv' with the actual path to your CSV file)
generate_quicklinks_html('ACT-Calendars.csv')