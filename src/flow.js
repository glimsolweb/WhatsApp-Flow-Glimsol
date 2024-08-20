/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


// this object is generated from Flow Builder under "..." > Endpoint > Snippets > Responses
const SCREEN_RESPONSES = {
  APPOINTMENT: {
    screen: "APPOINTMENT",
    data: {
      orderType: [
        {
            "id": "0_Next_Day_Delivery",
            "title": "Next Day Delivery"
        },
        {
            "id": "1_Same_Day_Delivery",
            "title": "Same Day Delivery"
        },
        {
            "id": "2_Advance_Order",
            "title": "Advance Order"
        },
        {
            "id": "3_Reservation",
            "title": "Reservation"
        },
      ]
    },
  },
  SUCCESS: {
    screen: "SUCCESS",
    data: {
      extension_message_response: {
        params: {
          flow_token: "REPLACE_FLOW_TOKEN",
          some_param_name: "PASS_CUSTOM_VALUE",
        },
      },
    },
  },
};


// Convert timestamp to a moment object in the 'Asia/Manila' timezone
import db from './firebase.js';
import moment from 'moment-timezone';
const convertTimestampToDate = (timestamp) => {
  const date = moment(parseInt(timestamp, 10)).tz('Asia/Manila');
  return date.format('MMMM D, YYYY');
};
 
export const getNextScreen = async (decryptedBody) => {
  const { screen, data, version, action, flow_token } = decryptedBody;
  // handle health check request
  if (action === "ping") {
    return {
      data: {
        status: "active",
      },
    };
  }

  // handle error notification
  if (data?.error) {
    console.warn("Received client error:", data);
    return {
      data: {
        acknowledged: true,
      },
    };
  }

  // handle initial request when opening the flow and display APPOINTMENT screen
  if (action === "INIT") {
    return {
      ...SCREEN_RESPONSES.APPOINTMENT,
      data: {
        ...SCREEN_RESPONSES.APPOINTMENT.data,
        // these fields are disabled initially. Each field is enabled when previous fields are selected
      },
    };
  }
  
  if (action === "data_exchange") {
    // handle the request based on the current screen
    switch (screen) {
      // handles when user interacts with APPOINTMENT screen
      case "APPOINTMENT":
        // update the appointment fields based on current user selection
        console.log('Received data on APPOINTMENT screen:', data.trigger);

        if(data.trigger === 'btn_submitted' && data.orderType && data.screen_0_TextInput_1 && data.screen_0_DatePicker_2 && data.screen_0_TextArea_3){
          let orderType = data.orderType;
          let customerName = data.screen_0_TextInput_1;
          let date = data.screen_0_DatePicker_2;
          let formattedDate = convertTimestampToDate(data.screen_0_DatePicker_2);
          let details = data.screen_0_TextArea_3;

          // Insert data into Realtime Database
          try {
            const ref = db.ref('flow_messages');  // Reference to the 'flow_messages' node
            const newMessageRef = ref.push();  // Create a new child reference
            await newMessageRef.set({
              order_type: orderType,
              customer_name: customerName,
              date: date,
              formatted_date: formattedDate,
              details: details,
            });
            console.log('Data Saved to Realtime Database!');
          } catch (error) {
            console.error('Error inserting data:', error);
          }

          return {
            ...SCREEN_RESPONSES.SUCCESS,
            data: {
              // extension_message_response: {
              //   params: {
              //     flow_token,
              //   }
              // },  
              data_submitted: data,
              date: formattedDate
            },
          };
        }else{
          return {
            ...SCREEN_RESPONSES.APPOINTMENT,
            data: {
              // copy initial screen data then override specific fields
              ...SCREEN_RESPONSES.APPOINTMENT.data,
            },
          };
        }

      default:
        break;
    }
  }

  

  console.error("Unhandled request body:", decryptedBody);
  throw new Error(
    "Unhandled endpoint request. Make sure you handle the request action & screen logged above."
  );
};
