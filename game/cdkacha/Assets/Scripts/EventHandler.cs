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
    [SerializeField]
    private Text MessageLabel;

    [SerializeField]
    private List<string> characterNames;
    [SerializeField]
    private List<Texture2D> characterPhotos;

    private int WishPoints = 100;
    private int WishCost = 10;
    private bool IsPulling = false;

    [DllImport("__Internal")]
    private static extern void StartPullRequest();

    private void GetRandomCharacter()
    {
        UpdateBalance();
        int characterIndex = Random.Range(0, characterNames.Count - 1);
        StartCoroutine(ShowCharacter(characterIndex));
    }

    public void OnPullClick()
    {
        if (WishPoints - WishCost >= 0 && !IsPulling)
        {
            IsPulling = true;
            WishPoints -= WishCost;
            #if UNITY_EDITOR
                GetRandomCharacter();
            #else
                StartPullRequest();
            #endif
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
        int charIndex = characterNames.IndexOf(charName);
        StartCoroutine(ShowCharacter(charIndex));
    }

    public void OnRechargeClick()
    {
        if (WishPoints + WishCost <= 100) {
            WishPoints += WishCost;
            UpdateBalance();
        }
    }

    private void UpdateBalance()
    {
        WishPointsLabel.text = $"{WishPoints}/100 Wish Points";
    }

    private IEnumerator ShowCharacter(int charIndex)
    {
        Texture2D value = characterPhotos[charIndex];
        if (value != null)
        {
            MessageLabel.text = characterNames[charIndex];
            Character.GetComponent<RawImage>().texture = value;
            Character.SetActive(true);
            LootBox.SetActive(false);
            yield return new WaitForSeconds(2f);
        }
        Character.SetActive(false);
        IsPulling = false;
        MessageLabel.text = "Click on the box to open";
        LootBox.SetActive(true);
    }
}
