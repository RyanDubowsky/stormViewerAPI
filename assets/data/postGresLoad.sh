#!/bin/sh

dbname="stormEvents"
username="postgres"
password="transit"
#path="/home/avail/code/stormViewer/data/"
#fileName="StormEvents_details-ftp_v1.0_d1952_c20140824.csv"
import_csv() {

echo "Importing csv file: $1 to stormEvents table"
psql -h lor.availabs.org -d "stormEvents" -U "postgres" << EOF
\\COPY "stormevents" FROM $1 CSV HEADER;
EOF

}

for csv_file in *.csv
do
    csv_folder_path="/home/avail/code/stormViewer/data"
    csv_file_path=$csv_folder_path/$csv_file    
#    if [[ $table_name == *histogram ]]
#    then
#        import_histogram $table_name $csv_file_path    
#    elif [[ $table_name == *millis ]]
#    then
        import_csv $csv_file_path        
#    fi
done
