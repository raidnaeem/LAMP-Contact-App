<?php

    $inData = getRequestInfo();

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
    if ($conn->connect_error) 
    {
        returnWithError( $conn->connect_error );
    } 
    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Email=?, Phone=? WHERE ID=? AND UserId=?");
        $stmt->bind_param("ssssii", $inData["firstName"], $inData["lastName"], $inData["email"], $inData["phoneNumber"], $inData["contactId"], $inData["userId"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0)
        {
            returnWithInfo("Contact updated successfully");
        }
        else
        {
            returnWithError("No changes made or contact not found");
        }

        $stmt->close();
        $conn->close();
    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function sendResultInfoAsJson( $obj )
    {
        header('Content-type: application/json');
        echo $obj;
    }

    function returnWithError( $err )
    {
        $retValue = '{"id":0,"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
    }

    function returnWithInfo( $msg )
    {
        $retValue = '{"id":1,"error":"", "message":"' . $msg . '"}';
        sendResultInfoAsJson( $retValue );
    }

?>
