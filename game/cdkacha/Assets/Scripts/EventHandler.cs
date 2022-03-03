using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System.Runtime.InteropServices;
public class EventHandler : MonoBehaviour
{
    [SerializeField]
    private GameObject LootBox;
    [SerializeField]
    private GameObject Character;

    [SerializeField]
    private Text WishPointsLabel;
    private Dictionary<string, Texture2D> characters;

    [SerializeField]
    private List<string> characterNames;
    [SerializeField]
    private List<Texture2D> characterPhoto;

    private int WishPoints = 100;
    private int WishCost = 10;
    private bool IsPulling = false;

    [DllImport("__Internal")]
    private static extern void StartPullRequest();


    private void Awake()
    {
        characters = new Dictionary<string, Texture2D>();
        for (int i = 0; i < characterNames.Count; i++) {
            characters.Add(characterNames[i], characterPhoto[i]);
        };
    }

    public void OnPullClick()
    {
        if (WishPoints - WishCost >= 0 && !IsPulling)
        {
            IsPulling = true;
            StartPullRequest();
            WishPoints -= WishCost;
        }
    }

    public void OnPullFail()
    {
        IsPulling = false;
        WishPoints += WishCost;
        UpdateBalance();
    }

    public void OnPullSuccess(string charName)
    {
        UpdateBalance();
        StartCoroutine(ShowCharacter(charName));
    }

    public void OnRechargeClick()
    {
        if (WishPoints + WishCost <= 100) {
            WishPoints += WishCost;
            UpdateBalance();
        }
    }

    private void HideBox()
    {
        LootBox.SetActive(false);
    }

    private void ShowBox()
    {
        LootBox.SetActive(true);
    }

    private void UpdateBalance()
    {
        WishPointsLabel.text = $"{WishPoints}/100 Wish Points";
    }

    private IEnumerator ShowCharacter(string charName)
    {
        Texture2D value;
        if (characters.TryGetValue(charName, out value))
        {
            Character.GetComponent<RawImage>().texture = value;
            Character.SetActive(true);
            HideBox();
            yield return new WaitForSeconds(2f);
        }
        Character.SetActive(false);
        IsPulling = false;
        ShowBox();
    }
}
