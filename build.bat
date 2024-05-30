SET CURRENTDIR="%cd%"
mkdir %CURRENTDIR%\package
xcopy /e /y %CURRENTDIR%\out %CURRENTDIR%\package
xcopy /e /y %CURRENTDIR%\resources %CURRENTDIR%\package