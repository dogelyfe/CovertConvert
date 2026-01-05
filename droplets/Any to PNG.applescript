-- Any to PNG Droplet
-- Converts any sips-compatible image format to PNG
-- Supports: HEIC, JPEG, TIFF, GIF, BMP, WebP (macOS 11+), and more

on open droppedItems
	-- Get the folder where this droplet lives
	set myPath to POSIX path of (path to me)
	set dropletFolder to do shell script "dirname " & quoted form of myPath
	set outputFolder to dropletFolder & "/PNG Output"

	-- Create output folder if it doesn't exist
	do shell script "mkdir -p " & quoted form of outputFolder

	-- Track conversion stats
	set successCount to 0
	set failCount to 0
	set failedFiles to {}

	-- Process each dropped file
	repeat with theItem in droppedItems
		set filePath to POSIX path of theItem

		-- Get filename without extension
		try
			set fileName to do shell script "basename " & quoted form of filePath & " | sed 's/\\.[^.]*$//'"
			set outputPath to outputFolder & "/" & fileName & ".png"

			-- Convert using sips
			do shell script "sips -s format png " & quoted form of filePath & " --out " & quoted form of outputPath
			set successCount to successCount + 1
		on error errMsg
			set failCount to failCount + 1
			set end of failedFiles to fileName
		end try
	end repeat

	-- Show completion notification
	if failCount = 0 then
		display notification "Converted " & successCount & " file(s) to PNG" with title "Any to PNG" subtitle "All conversions successful"
	else
		display notification "Converted " & successCount & ", failed " & failCount with title "Any to PNG" subtitle "Some files could not be converted"
	end if

	-- Open output folder
	do shell script "open " & quoted form of outputFolder
end open
