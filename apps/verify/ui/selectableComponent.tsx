import React, { useEffect, useState } from 'react';
import { Chain } from '../config/types/chain';
function SelectableComponent({ onSelectionChange }) {
    const [data, setData] = useState<Chain[]>([]);

    // Fetch the data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                //test data it will be removed
                const data = [{
                    "name": "Nautilus Chain",
                    "chain": "ETH",
                    "rpc": ["https://triton.api.nautchain.xyz"],
                    "faucets": ["https://faucet.eclipse.builders"],
                    "nativeCurrency": "Nautilus Zebec Testnet Tokens",
                    "infoURL": "https://docs.nautchain.xyz",
                    "shortName": "NAUT",
                    "chainId": 91002,
                    "networkId": 91002,
                    "explorers": [
                      {
                        "name": "Nautscan",
                        "url": "https://triton.nautscan.com",
                        "standard": "EIP3091"
                      }
                    ]
                  },{"name": "Triton",
                  "chain": "ETH",
                  "rpc": ["https://triton.api.nautchain.xyz"],
                  "faucets": ["https://faucet.eclipse.builders"],
                  "nativeCurrency": "Nautilus Zebec Testnet Tokens",
                  "infoURL": "https://docs.nautchain.xyz",
                  "shortName": "NAUT",
                  "chainId": 91002,
                  "networkId": 91002,
                  "explorers": [
                    {
                      "name": "Nautscan",
                      "url": "https://triton.nautscan.com",
                      "standard": "EIP3091"
                    }
                  ]
                }]
                setData(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchData();
    }, []);

    // Handle selection
    const handleSelection = (event :React.ChangeEvent<HTMLSelectElement>) => {
        onSelectionChange(event.target.value);
    };

    return (
        <select onChange={handleSelection} className='rounded-md  mx-1 pl-1  flex justify-center items-center border-2 border-[#2753bb] border-solid'>
            {data.map((item, index) => (
                <option key={index} value={item.chainId} >
                    {item.name}
                </option>
            ))}
        </select>
    );
}

export default SelectableComponent;
