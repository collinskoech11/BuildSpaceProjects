const CONTRACT_ADDRESS = "0xdd53DCEd9F8b3A25193F4c4F641D5987587eFCA6"
const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.ImageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };
export  {CONTRACT_ADDRESS, transformCharacterData};